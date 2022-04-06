import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import instance from "../../ethereum/instance";
import web3 from "../../ethereum/web3";

const New = () => {
  const router = useRouter();
  const [minCont, setMinCont] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(" ");
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
      await instance.methods
        .createCampaign(minCont)
        .send({ from: accounts[0] });
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  return (
    <div>
      <Layout>
        <h3>Create a new campaign</h3>
        <Form onSubmit={onSubmit} error={!!error}>
          <Form.Field>
            <label>Minimum Contributions</label>
            <Input
              label="wei"
              labelPosition="right"
              value={minCont}
              onChange={(event) => setMinCont(event.target.value)}
            />
          </Form.Field>
          <Message error header="Oops!" content={error} />
          <Button loading={loading} primary>
            Create
          </Button>
        </Form>
      </Layout>
    </div>
  );
};

export default New;
