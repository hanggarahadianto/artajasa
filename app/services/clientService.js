const { createUserWithRole } = require('./userService');
const { Client, Admin, AdminClient, User } = require('../../database/models');
const { userSchema, clientSchema } = require('../util/validator');

async function createClient({
  username,
  password,
  adminIds,
  institutionCode,
  formatMessageId,
}) {
  const roleType = 3;

  await userSchema.validateAsync(
    { username, password, roleType },
    { abortEarly: false },
  );

  await clientSchema.validateAsync(
    {
      adminIds,
      institutionCode,
      formatMessageId,
    },
    { abortEarly: false },
  );

  const user = await createUserWithRole({ username, password, roleType });
  if (!user.success) {
    return { success: false, error: user.error };
  }

  try {
    const newClient = await Client.create({
      id: user.user.id,
      userId: user.user.id,
      institutionCode,
      formatMessageId,
    });

    const validAdminIds = (await Admin.findAll()).map((admin) => admin.userId);
    const createdAdminClients = [];

    for (const adminId of adminIds) {
      if (validAdminIds.includes(adminId)) {
        const createdAdminClient = await AdminClient.create({
          clientId: newClient.id,
          adminId: adminId,
        });

        createdAdminClients.push(createdAdminClient);
      } else {
        await User.destroy({ where: { id: user.user.id } });
        return { success: false, error: `Admin with ID: ${adminId} not found` };
      }
    }

    return { success: true, newClient, createdAdminClients };
  } catch (error) {
    await User.destroy({ where: { id: user.user.id } });
    return { success: false, error: error.message };
  }
}

module.exports = { createClient };
