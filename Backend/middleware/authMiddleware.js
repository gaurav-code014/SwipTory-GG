import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied.' });

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token, authorization denied.' });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = { _id: verified._id };
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token has expired.' });
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token.' });
        } else {
            return res.status(400).json({ message: 'Token is not valid.' });
        }
    }
};

export default authMiddleware;
