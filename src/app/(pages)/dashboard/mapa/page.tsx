"use client";

import { useEffect, useState, useRef, FC } from "react";

import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { useFetch } from "@/app/hooks/useFetch";
import { Box, Button, Icon, Text, useDisclosure } from "@chakra-ui/react";
import { Path } from "@phosphor-icons/react";
import { BasicModal } from "@/app/components/BasicModal";

type Tree = {
  key: string;
  name: string;
  lat: number;
  lng: number;
};

const MapPage: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [openInfoWindow, setOpenInfoWindow] = useState<boolean>(false);
  const { data: clientes } = useFetch<any>("/user/calculate-route");

  const formatted: Tree[] = clientes?.data?.map((cliente: any) => ({
    name: cliente.nome,
    lat: cliente.latitude,
    lng: cliente.longitude,
    whatsapp: cliente.numeroWhatsApp,
    endereco: cliente.endereco,
    key: JSON.stringify({
      name: cliente.nome,
      lat: cliente.latitude,
      lng: cliente.longitude,
    }),
  }));

  // Update markers
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      >
        <Map
          mapId={"bf51a910020fa25a"}
          zoom={12}
          center={
            formatted?.length
              ? { lat: formatted[0].lat, lng: formatted[0].lng }
              : { lat: -10.64, lng: -55.41 }
          }
        >
          <BasicModal
            isOpen={isOpen}
            onClose={() => onClose()}
            modalTitle="Rota de Entrega"
          >
            {clientes?.data?.map((cliente: any) => (
              <Box key={cliente.id}>
                <table>
                  <tr>
                    <td>
                      <Text
                        fontSize={"12px"}
                        color={"brand.neutral.500"}
                        mr={"4"}
                      >
                        <span
                          className="tree"
                          style={{ fontSize: "1rem" }}
                          role="img"
                          aria-label="tree"
                        >
                          {clientes?.data?.indexOf(cliente) + 1}
                        </span>
                      </Text>
                    </td>

                    <td>
                      <Text
                        fontSize={"12px"}
                        color={"brand.neutral.500"}
                        mr={"4"}
                      >
                        {
                          <span
                            className="tree"
                            style={{ fontSize: "1rem" }}
                            role="img"
                            aria-label="tree"
                          >
                            🏠
                          </span>
                        }
                      </Text>
                    </td>
                    <td>
                      <Text fontSize={"14px"} color={"brand.neutral.500"}>
                        {cliente.nome} -
                      </Text>
                    </td>
                    <td>
                      <Text fontSize={"13px"} color={"brand.neutral.500"}>
                        {cliente.endereco.address}, {cliente.endereco.number} -{" "}
                        {cliente.endereco.street}, {cliente.endereco.city} -{" "}
                        {cliente.endereco.state}
                      </Text>
                    </td>
                  </tr>
                </table>
              </Box>
            ))}
            {!clientes?.data ? (
              <Text
                fontSize={"15px"}
                color={"brand.neutral.500"}
                mb={"4"}
                w={"100%"}
                bg={"red.100"}
                rounded={"md"}
                textAlign={"center"}
                p={"2"}
              >
                Não há clientes cadastrados
              </Text>
            ) : null}
          </BasicModal>
          <Button
            position="absolute"
            bottom="4"
            left="4"
            onClick={() => onOpen()}
            leftIcon={<Icon as={Path} fontSize="xl" />}
            boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
          >
            Calcular Rota
          </Button>
          {formatted?.map((point: any) => (
            <AdvancedMarker
              position={point}
              key={point.key}
              ref={(marker) => setMarkerRef(marker, point.key)}
              onClick={() => setOpenInfoWindow(true)}
            >
              <span
                className="tree"
                style={{ fontSize: "1rem" }}
                role="img"
                aria-label="tree"
              >
                🏠
              </span>
              <InfoWindow
                anchor={markers[point.key]}
                onCloseClick={() => setOpenInfoWindow(false)}
                key={point.key}
              >
                <Text
                  fontSize={"11px"}
                  color={"brand.neutral.500"}
                  w={"100%"}
                  rounded={"md"}
                  textAlign={"center"}
                  p={"2"}
                  fontWeight={"bold"}
                >
                  {point.name}
                </Text>
                <Text
                  fontSize={"9px"}
                  color={"brand.neutral.500"}
                  w={"100%"}
                  rounded={"md"}
                  textAlign={"center"}
                  fontWeight={"bold"}
                >
                  {point.endereco.address}, {point.endereco.number} -{" "}
                  {point.endereco.street}, {point.endereco.city} -{" "}
                  {point.endereco.state}
                </Text>
              </InfoWindow>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </>
  );
};

export default MapPage;
