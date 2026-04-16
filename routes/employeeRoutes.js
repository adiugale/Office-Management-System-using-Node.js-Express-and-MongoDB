const express = require('express');
const router = express.Router();
const empController = require('../controllers/employeeController');

router.get('/view', (req, res) => {
  res.render('employees/index');
});

router.post('/', empController.createEmployee);
router.get('/', empController.getEmployees);
router.put('/:id', empController.updateEmployee);
router.delete('/:id', empController.deleteEmployee);

module.exports = router;