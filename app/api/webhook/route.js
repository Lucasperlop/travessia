import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    await supabase
      .from('profiles')
      .update({ assinante: true, stripe_customer_id: session.customer })
      .eq('id', userId);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', subscription.customer)
      .single();

    if (profile) {
      await supabase
        .from('profiles')
        .update({ assinante: false })
        .eq('id', profile.id);
    }
  }

  return Response.json({ received: true });
}