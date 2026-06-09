export const ERC8004_REGISTRY = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432";
export const getAgentCard = () => {
    return fetch('/.well-known/agent-card.json').then(res => res.json());
};
