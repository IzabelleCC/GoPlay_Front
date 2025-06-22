import React, { useState, useEffect } from "react";
import { VStack, FlatList, Text, Pressable, useTheme } from "native-base";
import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from '@env';
import AutoGrowingTextArea from "./AutoGrowingTextArea"; // ajuste o caminho se necessário

interface LocationInputProps {
  value: string;
  onChange: (address: string, lat: number, lng: number) => void;
}

interface Prediction {
  place_id: string;
  description: string;
}

export default function LocationInput({ value, onChange }: LocationInputProps) {
  const { colors } = useTheme();

  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const [selected, setSelected] = useState(false);
  const [hasTyped, setHasTyped] = useState(false); 

  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  useEffect(() => {
    if (hasTyped && inputValue.length > 2 && !selected) {
      fetchSuggestions(inputValue);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, hasTyped]);
  

  const fetchSuggestions = async (input: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input,
            key: GOOGLE_MAPS_API_KEY,
            language: 'pt-BR',
            components: 'country:br',
          },
        }
      );

      if (response.data.predictions) {
        setSuggestions(response.data.predictions);
      }
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
    }
  };

  const handleSelect = async (prediction: Prediction) => {
    try {
      setSelected(true);
      setInputValue(prediction.description);
      setSuggestions([]);

      const detailsResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: prediction.place_id,
            key: GOOGLE_MAPS_API_KEY,
            language: 'pt-BR',
          },
        }
      );

      const location = detailsResponse.data.result.geometry.location;
      console.log("Selecionado:", prediction.description, location);

      onChange(prediction.description, location.lat, location.lng);
    } catch (error) {
      console.error("Erro ao buscar detalhes do local:", error);
    }
  };

  return (
    <VStack space={2}>
      <AutoGrowingTextArea
        value={inputValue}
        onChange={(text) => {
          setInputValue(text);
          setSelected(false);
          setHasTyped(true); 
          onChange("", 0, 0);
        }}
        placeholder="Local"
        label="Local"
        minHeight={50}
        maxHeight={150}
      />

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSelect(item)}
              p={2}
              borderBottomWidth={1}
              borderColor={colors.gray[200]}
            >
              <Text color={colors.black}>{item.description}</Text>
            </Pressable>
          )}
          maxHeight={200}
          bg={colors.white}
          borderRadius={10}
          shadow={1}
          mt={1}
        />
      )}
    </VStack>
  );
}
