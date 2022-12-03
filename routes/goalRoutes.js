const express = require('express')
const router = express.Router()
const {getgoals,setgoal,updategoal,deletegoal} = require('../controller/goalController')
const {protect} = require('../middleware/authMiddleware')

router.route('/').get(protect ,getgoals).post(protect ,setgoal)
router.route('/:id').put(protect ,updategoal).delete(protect ,deletegoal)



module.exports = router