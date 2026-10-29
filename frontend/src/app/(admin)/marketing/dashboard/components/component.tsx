import react from "react";
import { useState } from "react";
type TestProps = {
  name: string;
  surname: string;
};

export default function Test({ name, surname }: TestProps) {
  const [user, setUser] = useState({
    name: "shubham",
    surname: "yadav",
    phone: "8329216823",
  });
  const handleClick = () => {
    setUser((prev) => ({
      ...prev,
      name: "archana",
      surname: "gore",
      phone: "blocked",
    }));
  };

  const resetCount = () => {
    setUser((prev) => ({
      ...prev,
      name: "shubham",
      surname: "yadav",
      phone: "8329216823",
    }));
  };
  return (
    <div>
      <p>
        <p>name ={user.name}</p>
        <p>surname:{user.surname}</p>
        <p>phone:{user.phone}</p>

        <button onClick={handleClick}>Add Count</button>
        <button onClick={resetCount}>Reset Count</button>
      </p>
    </div>
  );
}
