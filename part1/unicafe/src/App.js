import { useState } from "react";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <UserFeedback
        title={"give feedback"}
        eventHandlers={{
          good: () => setGood(good + 1),
          neutral: () => setNeutral(neutral + 1),
          bad: () => setBad(bad + 1),
        }}
      />
      <Statistics
        title={"statistics"}
        stats={{
          good: good,
          neutral: neutral,
          bad: bad,
        }}
      />
    </div>
  );
};

const UserFeedback = ({ title, eventHandlers }) => {
  return (
    <div>
      <h1>{title}</h1>
      <Button title={"good"} onClick={eventHandlers.good} />
      <Button title={"neutral"} onClick={eventHandlers.neutral} />
      <Button title={"bad"} onClick={eventHandlers.bad} />
    </div>
  );
};

const Button = ({ title, onClick }) => (
  <button onClick={onClick}>{title}</button>
);

const Statistics = ({ title, stats }) => {
  const all = Object.keys(stats).reduce((prev, curr) => prev + stats[curr], 0);
  const avgMap = {
    good: 1,
    neutral: 0,
    bad: -1,
  };
  const hasFeedback = all != 0;
  const avg =
    all != 0
      ? (
          Object.keys(stats).reduce(
            (prev, curr) => prev + stats[curr] * avgMap[curr],
            0
          ) / all
        ).toFixed(1)
      : 0;
  const pos = all != 0 ? ((stats.good / all) * 100).toFixed(1) : 0;
  return (
    <div>
      <h1>{title}</h1>
      {hasFeedback ? (
        <table>
          <tbody>
            <StatisticLine text={"good"} value={stats.good} />
            <StatisticLine text={"neutral"} value={stats.neutral} />
            <StatisticLine text={"bad"} value={stats.bad} />
            <StatisticLine text={"all"} value={all} />
            <StatisticLine text={"average"} value={avg} />
            <StatisticLine text={"positive"} value={`${pos} %`} />
          </tbody>
        </table>
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
};

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

export default App;
