
const{Task} = require("../models/Task");
const{User} = require("../models/User");

module.exports ={
    isTaskOwner:async (req,res,next)=>{
        let t_id = req.params.id;//task id
        // console.log(req.user._id);
        let task = await Task.findOne({_id:t_id,created_by:`${req.user._id}`});
        // console.log(task);
        if(task){
            next();
        }else{
            req.flash("error","You Can't Access That Because You Are Not Owner Of That.");
            res.redirect(`/user/profile/${req.user._id}`);
        }
    },

    isOwner:async (req,res,next)=>{
        let user_id = req.params.id;//user id
        
        if(user_id == `${req.user._id}`){
            next();
        }else{
            req.flash("error","You Can't Access That Because You Are Not Owner Of That.");
            res.redirect(`/user/profile/${req.user._id}`);
        }
    },

} 
