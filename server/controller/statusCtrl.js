const Status = require("../model/Status")
const User = require("../model/User")


const statusCtrl = {
    createStatus: async (req, res) => {
        try {
            const newStatus = new Status({ userId: req.user._id, statusText: req.body.statusText, color: req.body.color })
            await newStatus.save()
            return res.status(200).json(newStatus)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    getUserStatus: async (req, res) => {
        try {
            let statuses = await Status.aggregate([

                {
                    $group: {
                        _id: "$userId", value: {
                            $addToSet: { statusText: "$statusText", color: "$color", statusId: "$_id", userId: "$userId", expiresAt: "$expiresAt", createdAt: "$createdAt" }
                        }
                    }
                },
                // {
                //     $sort: { "value.createdAt": -1 }
                // },
            ])
            statuses = await User.populate(statuses, {
                path: "_id"
            })
            // .sort({ updatedAt: -1 })



            return res.status(200).json(statuses)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    },
    deleteStatus: async (req, res) => {
        try {
            await Status.findByIdAndDelete(req.params.statusId)
            return res.status(200).json('Status deleted')
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = statusCtrl