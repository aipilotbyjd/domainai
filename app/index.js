import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, List, Accordion } from "react-native-paper";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

const BusinessNameGenerator = () => {
  const [keywords, setKeywords] = useState("");
  const [businessNames, setBusinessNames] = useState([]);
  const [domainNames, setDomainNames] = useState([]);

  const generateNamebyAI = async () => {
    setLoading(true);
    const apifirst =
      "sk-2YFFU91amPed57CKkY3ZT3BlbkFJbZY0bU3yHHSfVj8AlTjvBYJAYDEEPDHRANGIYA";

    const configuration = new Configuration({
      apiKey: apifirst.replace("BYJAYDEEPDHRANGIYA", ""),
    });

    const openai = new OpenAIApi(configuration);

    const prompt = `generate 50 startup names using keyword ${inputValue} and separate names by ','`; // Fixed typo 'genrate' to 'generate'

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Extract generated startup names from the response
    const generatedText = response.data.choices[0].text;
    const startupNames = generatedText
      .replace(/^\n\n/, "")
      .slice(0, -1)
      .split(",");

    setLoading(false);

    setBusinessNames(startupNames);

    console.log(businessNames);
  };

  const generateBusinessNames = async () => {
    try {
      const response = await axios.get(
        `https://api.businessnamegenerator.com/v1.0/businessnames?query=${keywords}`
      );
      setBusinessNames(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const checkDomainAvailability = async (businessName) => {
    try {
      const response = await axios.get(
        `https://api.domainr.com/v2/status?domain=${businessName}.com`
      );
      const available = response.data.status[0].status === "inactive";
      setDomainNames((domainNames) => [
        ...domainNames,
        { name: businessName, available },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item}
      onPress={() => checkDomainAvailability(item)}
      right={() =>
        domainNames.find((domain) => domain.name === item) && (
          <List.Icon
            color={
              domainNames.find((domain) => domain.name === item).available
                ? "green"
                : "red"
            }
            icon="check-circle"
          />
        )
      }
    />
  );

  const renderAccordion = () => (
    <Accordion title="Available Domain Names">
      <List.Section>
        {businessNames.map((businessName) =>
          renderItem({ item: businessName })
        )}
      </List.Section>
    </Accordion>
  );

  return (
    <View style={styles.container}>
      <TextInput
        label="Keywords"
        value={keywords}
        onChangeText={setKeywords}
        style={styles.input}
      />
      <Button mode="contained" onPress={generateBusinessNames}>
        Generate Business Names
      </Button>
      {domainNames.length > 0 && renderAccordion()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
});

export default BusinessNameGenerator;
