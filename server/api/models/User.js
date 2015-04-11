var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username  : { type: 'string', unique: true, required: true },
    email     : { type: 'email',  unique: true, required: true },
    passports : { collection: 'Passport', via: 'user' },
    isOfficer : { type: 'boolean', unique: false, required: true }
  }
};

module.exports = User;
