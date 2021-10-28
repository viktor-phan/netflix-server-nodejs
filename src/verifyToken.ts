import jwt from "jsonwebtoken";
const SECRET_KEY: string = process.env.SECRET_KEY as string;

const verify = (req: any, res: any, next: any) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err: any, data: any) => {
      if (err) res.status(403).json("Token is not valid");
      req.user = data;
      next();
    });
  } else {
    return res.status(401).json("Your are not authenticated");
  }
};
export default verify;
