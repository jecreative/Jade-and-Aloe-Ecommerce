const stripeCharge = {
  id: 'pi_1HmmO3As4fA7BMN8lhBJYSuo',
  amount_received: 6718,
  payload.charge.data[0].receipt_url
  
  charges: {
    data: [
      {
        billing_details: {
          address: {
            city: 'San Jose',
            line1: '123 Main St, Apt 7',
            postal_code: '94321',
            state: 'CA',
          },
          email: 'j@example.com',
          name: 'Jordan Esguerra',
          phone: '(858) 232-7090',
        },
        currency: 'usd',
        description: 'Testing description',
        paid: true,
        payment_method_details: {
          card: {
            brand: 'visa',
            country: 'US',
            exp_month: 4,
            exp_year: 2024,
            last4: '4242',
          },
          type: 'card',
        },
        receipt_url:
          'https://pay.stripe.com/receipts/acct_1HgIrOAs4fA7BMN8/ch_1HmmO4As4fA7BMN8eixkxCiw/rcpt_INXT3TahepMY1Fz733h121uGHA2F2A0',
        status: 'succeeded',
      },
    ],
  },
}

const order = {
  paymentId: 'pi_1HmmO3As4fA7BMN8lhBJYSuo',
  amount_received: 6718,
  billing_details: {
    address: {
      city: 'San Jose',
      line1: '123 Main St, Apt 7',
      postal_code: '94321',
      state: 'CA',
    },
    email: 'j@example.com',
    name: 'Jordan Esguerra',
    phone: '(858) 232-7090',
  },
  currency: 'usd',
  description: 'Testing description',
  paid: true,
  payment_method: {
    brand: 'visa',
    country: 'US',
    exp_month: 4,
    exp_year: 2024,
    last4: '4242',
    type: 'card',
  },
  receipt_url:
    'https://pay.stripe.com/receipts/acct_1HgIrOAs4fA7BMN8/ch_1HmmO4As4fA7BMN8eixkxCiw/rcpt_INXT3TahepMY1Fz733h121uGHA2F2A0',
  status: 'succeeded',
}
