function Card({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag className={`card-surface rounded-3xl ${className}`} {...props}>
      {children}
    </Tag>
  );
}

export default Card;
