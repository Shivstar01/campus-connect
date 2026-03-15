const UserCard = ({ name, email }) => {
  return (
    <div style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
      <h3>{name}</h3>
      <p>📧 {email}</p>
    </div>
  );
};

export default UserCard;  
