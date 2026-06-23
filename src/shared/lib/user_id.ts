const userIdStorageKey = 'ozoz_user_id';

const createUserId = () => {
    // if (crypto.randomUUID) {
    //     return crypto.randomUUID();
    // }

    // return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return crypto.randomUUID();
};

export const getUserId = () => {
    const storedUserId = localStorage.getItem(userIdStorageKey);

    if (storedUserId) {
        return storedUserId;
    }

    const userId = createUserId();

    localStorage.setItem(userIdStorageKey, userId);

    return userId;
};
