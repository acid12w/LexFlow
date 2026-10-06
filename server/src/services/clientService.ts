import Matter from "#models /matter.js";
import Task from "#models /tasks.js";
import Client from "../models /client.js";

export const createClientService = async (data: any) => {
  const client = await Client.create(data);
  return client;
};

export const getClientService = async (clientId: string | string[]) => {
  const client = await Client.findById({ _id: clientId });
  return client;
};

export const getClientByClientIdService = async (
  clientId: string | string[]
) => {
  const client = await Client.findOne({ _id: clientId });
  return client;
};

export const getAllClientsService = async (firmId: string | undefined) => {
  const client = await Client.find({ firmId });
  return client;
};

export const getClientMatters = async (clientId: string | string[]) => {
  const response = await Matter.find({
    clientId,
  }).lean();

  return {
    response,
  };
};

export const getCaseByClientId = async (clientId) => {
  const matters = await Matter.find({
    clientId,
  }).lean();

  const matterIds = matters.map((m) => m._id);

  const milestones = await Task.find({
    matterId: { $in: matterIds },
    mileStone: true,
  })
    .sort({ order: 1 })
    .lean();

  const groupedMilestones = milestones.reduce((acc, task) => {
    const key = task.matterId.toString();

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(task);

    return acc;
  }, {} as Record<string, Task[]>);

  const response = matters.map((matter) => ({
    milestones: groupedMilestones[matter._id.toString()] ?? [],
  }));

  console.log(response);

  return {
    response,
  };
};

export const updateClientService = async (data: any) => {
  const client = await Client.findByIdAndUpdate(data._id, data, { new: true });
  return client;
};

export const deleteClientService = async (clientId: any) => {
  const client = await Client.findByIdAndDelete({ _id: clientId });
  return client;
};
