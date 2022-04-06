import React, { useState } from "react";
import web3 from "../../../../ethereum/web3";
import viewInstance from "../../../../ethereum/viewInstance";
import { Form, Message, Button, Input } from "semantic-ui-react";
import Link from "next/link";
import Layout from "../../../../components/Layout";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { id } = context.query;
  return { props: { address: id } };
}

export default ({ address }) => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async (event) => {
    event.preventDefault();
    const campaign = viewInstance(address);
    setLoading(true);
    setError("");
    try {
      let accounts;
      if (window.ethereum) {
        accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      } else {
        accounts = web3.eth.getAccounts();
      }

      console.log(accounts[0]);
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });
      router.push(`/campaigns/${address}/requests`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  return (
    <div>
      <Layout>
        <Link href={`/campaigns/${address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={onSubmit} error={!!error}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
            />
          </Form.Field>
          <Message error header="Oops!" content={error} />
          <Button loading={loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    </div>
  );
};
