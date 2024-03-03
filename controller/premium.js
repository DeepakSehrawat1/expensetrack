const authorisationuser = require("../middleware/auth");
const Razorpay = require("razorpay");
const Order = require("../model/order");
require("dotenv").config();

exports.registringpremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log(rzp.key_id);

    const amount = 2500;
    const order = await rzp.orders.create({ amount, currency: "INR" });

    await req.user.createOrder({ orderId: order.id, status: "PENDING" });

    return res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    console.error("Error creating premium registration:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatingpremium = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });

    const promise1 = order.update({
      paymentId: payment_id,
      status: "SUCCESSFULL",
    });

    const promise2 = req.user.update({ isPremium: true });

    Promise.all([promise1, promise2])
      .then(() => {
        res
          .status(202)
          .json({ success: true, message: "Transaction Successful" });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    throw new Error(err);
  }
};
