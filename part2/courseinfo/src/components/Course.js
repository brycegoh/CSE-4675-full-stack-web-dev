const Course = ({ course }) => {
  return (
    <div>
      <Header title={course.name} />
      <Content content={course.parts} />
    </div>
  );
};

const Header = ({ title }) => <h1>{title}</h1>;

const Content = ({ content }) => {
  const total = content.reduce((prev, curr) => prev + curr.exercises, 0);
  return (
    <>
      {content.map((e) => (
        <Part part={e} key={e.id} />
      ))}
      <p>
        <b>{`total of ${total} exercises`}</b>
      </p>
    </>
  );
};

const Part = ({ part }) => {
  let { name, exercises, id } = part;

  return <p>{`${name} ${exercises}`}</p>;
};

export default Course;
