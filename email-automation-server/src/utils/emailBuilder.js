const { renderTemplate, templates } = require('../templates/templateManager');

const buildEmailForUser = (emailTypeKey, user) => renderTemplate(emailTypeKey, user);

const resolveEmailType = (type) => {
  const key = String(type || 'application').toLowerCase().trim();
  return templates[key] ? key : null;
};

module.exports = { buildEmailForUser, resolveEmailType, renderTemplate };
