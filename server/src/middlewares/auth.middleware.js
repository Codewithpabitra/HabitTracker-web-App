import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) {
        return res.status(401).json({ message: "Not authorized" });
    }

    req.user = { _id: decoded.id }; // ← Wrap it in an object
    next();
  } catch (error) {
    console.error("Error in auth middleware : ", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;
