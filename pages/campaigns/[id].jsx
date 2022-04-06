import { useRouter } from "next/router";
import React from "react";
import { Card } from "semantic-ui-react";
import Layout from "../../components/Layout";
import viewInstance from "../../ethereum/viewInstance";
import web3 from "../../ethereum/web3";

export async function getServerSideProps() {
  const router = useRouter();
  const campaign = viewInstance(router.query.id);
  const summary = await campaign.methods.getSummary().call();
  return {
    props: {
      summary: {
        minCont: summary[0],
        balance: summary[1],
        reqCount: summary[2],
        appCount: summary[3],
        manager: summary[4],
      },
    },
  };
}

const renderCards = (summary) => {
  const { balance, minCont, reqCount, appCount, manager } = summary;
  const items = [
    {
      header: manager,
      meta: "Address of Manager",
      description:
        "The manager created this campaign and can create requests to withdraw money",
      style: { overflowWrap: "break-word" },
    },
    {
      header: minCont,
      meta: "Minimum Contribution (wei)",
      description: "You must contribute at least this much wei to contribute",
    },
    {
      header: reqCount,
      meta: "Number of Requests",
      description: "A request tries to withdraw money from the contract",
    },
    {
      header: appCount,
      meta: "Number of Approvers",
      description: "Number of people who have already donated to this campaign",
    },
    {
      header: web3.utils.fromWei(balance, "ether"),
      meta: "Campaign Balance (ether)",
      description:
        "The balance is how much money this campaign has left to spend",
    },
  ];
  return <Card.Group items={items} />;
};

export default ({ summary }) => {
  return (
    <div>
      <Layout>
        <h3>Campaign Show</h3>
        {renderCards(summary)}
      </Layout>
    </div>
  );
};
