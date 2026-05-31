/**
 * Maps frontend payload shape to fields expected by template handlers.
 *
 * Frontend sends:
 * { name, email, emailType, userId, dynamicData: { role, joiningDate, ... } }
 */
const normalizeSendBody = (req, res, next) => {
  const { dynamicData = {}, ...rest } = req.body;

  req.body = {
    ...rest,
    name: rest.name,
    email: rest.email,
    emailType: rest.emailType,
    role: dynamicData.role ?? rest.role ?? 'Team Member',
    startDate:
      dynamicData.joiningDate ??
      dynamicData.startDate ??
      rest.startDate ??
      dynamicData.deadline ??
      'TBD',
    date: dynamicData.date ?? rest.date ?? 'TBD',
    time: dynamicData.time ?? rest.time ?? 'TBD',
    location: dynamicData.location ?? rest.location,
    meetingLink: dynamicData.meetingLink ?? rest.meetingLink,
    dueDate: dynamicData.dueDate ?? dynamicData.deadline ?? rest.dueDate ?? 'TBD',
    checklistLink: dynamicData.checklistLink ?? rest.checklistLink
  };

  next();
};

module.exports = normalizeSendBody;
