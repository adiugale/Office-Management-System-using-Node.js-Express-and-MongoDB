const Employee = require('../models/Employee');

exports.createEmployee = async (req, res) => {
  try {
    const emp = new Employee(req.body);
    await emp.save();
    res.status(201).json(emp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '', department, jobTitle } = req.query;

    let query = {
      name: { $regex: search, $options: 'i' }
    };

    if (department) query.department = department;
    if (jobTitle) query.jobTitle = { $regex: jobTitle, $options: 'i' };

    const employees = await Employee.find(query)
      .populate('department')
      .populate('supervisor')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Employee.countDocuments(query);

    res.json({ employees, total });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  