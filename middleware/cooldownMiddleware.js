// middlewares/cooldownMiddleware.js
const checkCooldown = async (req, res, next) => {
    try {
        const activeCooldown = await Sale.findOne({
            farmer: req.body.farmerId,
            cooldownEndDate: { $gt: new Date() }
        }).sort({ cooldownEndDate: -1 });

        if (activeCooldown) {
            const daysLeft = Math.ceil((activeCooldown.cooldownEndDate - new Date()) / (1000 * 60 * 60 * 24));
            return res.status(400).render('salesDashboard', {
                error: `Farmer must wait ${daysLeft} days before requesting again (until ${activeCooldown.cooldownEndDate.toLocaleDateString()})`,
                currentUser: req.user,
                farmers: await User.find({ role: 'farmer' }).lean(),
                cooldownData: {
                    active: true,
                    endDate: activeCooldown.cooldownEndDate
                }
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};