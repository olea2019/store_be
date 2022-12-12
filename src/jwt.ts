import jwt from 'jsonwebtoken';

const secret = 'my_secret';

export const createToken = (payload: any): string => {
    const token = jwt.sign(payload, secret, { expiresIn: '2 days' });

    return token;
};

export const decodeToken = (token: string) => {
    const payload = jwt.verify(token, secret, { ignoreExpiration: false });
    if (!payload) {
        throw new Error('Invalid auth token');
    }
    
    return payload;
}