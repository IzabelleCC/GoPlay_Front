import React, { useState, useEffect } from "react";
import { VStack, Input, FlatList, Text, Pressable, useTheme } from "native-base";
import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from '@env';

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

  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  useEffect(() => {
    if (inputValue.length > 2 && !selected) {
      fetchSuggestions(inputValue);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

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

      // Buscar detalhes para pegar lat/lng
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
      <Input
        placeholder="Local"
        value={inputValue}
        onChangeText={(text) => {
          setInputValue(text);
          setSelected(false);
          onChange("", 0, 0);
        }}
        bg={colors.gray[100]}
        borderRadius={10}
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
