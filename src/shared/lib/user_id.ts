function createUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, char => {
        const random = Math.random() * 16 | 0;
        const value = char === "x" ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
}
const userIdStorageKey = 'ozoz_user_id';

const createUserId = () => {
    return createUUID();
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
