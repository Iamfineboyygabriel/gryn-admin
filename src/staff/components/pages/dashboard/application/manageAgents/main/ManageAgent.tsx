import AllAgents from "../allAgents/AllAgents";

const ManageAgent = () => {
  return (
    <main className="font-outfit">
      <header className="flex justify-between">
        <h1 className="font-medium text-xl">All Agents</h1>
      </header>
      <AllAgents />
    </main>
  );
};

export default ManageAgent;
