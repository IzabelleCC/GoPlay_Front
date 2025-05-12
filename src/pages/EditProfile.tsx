import React, { useEffect, useState } from "react";
import {
    VStack,
    FormControl,
    Input,
    Button,
    Text,
    useTheme,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    useToast
} from "native-base";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserService } from "../api/user/userService";
import { UpdateUserPayload } from "../api/user/userTypes";
import DatePicker from "../components/form/DatePicker";
import SelectField from "../components/form/SelectField";
import Logo from "../assets/logo.png";
import GenericModal from "../components/modals/GenericModal";

export default function EditProfile() {
    const { colors, fontSizes } = useTheme();
    const navigation = useNavigation();
    const toast = useToast();

    const [userData, setUserData] = useState<UpdateUserPayload["data"]>({
        id: "",
        userName: "",
        name: "",
        instagramPage: "",
        gender: "",
        birthDate: "",
        tShirtSize: ""
    });

    const [readOnlyFields, setReadOnlyFields] = useState({
        email: "",
        cpfCnpj: ""
    });

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<"success" | "error">("success");

    const fetchUserData = async () => {
        try {
            const storedUserName = await AsyncStorage.getItem("userName");
            if (storedUserName) {
                const data = await UserService.getUserByUserName(storedUserName);
                setUserData({
                    id: data.id,
                    userName: data.userName,
                    name: data.name,
                    instagramPage: data.instagramPage,
                    gender: data.gender,
                    birthDate: data.birthDate,
                    tShirtSize: data.tShirtSize
                });
                setReadOnlyFields({
                    email: data.email,
                    cpfCnpj: data.cpfCnpj
                });
                await AsyncStorage.setItem("userType", data.userType.toString());
                console.log("Dados do usuário:", data);
            }
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
        }
    };

    const showReadOnlyTip = (message: string) => {
        toast.show({
            title: message,
            placement: "top",
            bg: "gray.700"
        });
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const payload: UpdateUserPayload = { data: userData };
            await UserService.updateUser(payload);
            setModalMessage("Dados atualizados com sucesso.");
            setModalType("success");
            setModalVisible(true);
        } catch (error: any) {
            console.error("Erro ao atualizar:", error);
            setModalMessage(error.message || "Erro ao atualizar os dados.");
            setModalType("error");
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        if (modalType === "success") {
            navigation.navigate("MyProfile" as never);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                style={{ flex: 1, backgroundColor: colors.white }}
                contentContainerStyle={{ paddingBottom: 30 }}
                keyboardShouldPersistTaps="handled"
            >
                <VStack flex={1} p={5} space={5} alignItems="center">
                    <Image source={Logo} alt="Logo" width={70} height={70} resizeMode="contain" mb={4} />
                    <Text fontSize={fontSizes.xl} fontWeight="bold" textAlign="center">
                        Editar Perfil
                    </Text>

                    <FormControl w="100%">
                        <FormControl.Label>Nome</FormControl.Label>
                        <Input
                            value={userData.name}
                            onChangeText={(v) => setUserData({ ...userData, name: v })}
                            bg={colors.gray[100]}
                            borderColor={colors.blue[800]}
                            borderWidth={1}
                            borderRadius={10}
                        />
                    </FormControl>

                    <FormControl w="100%">
                        <FormControl.Label>Email</FormControl.Label>
                        <Input
                            value={readOnlyFields.email}
                            isReadOnly
                            onFocus={() => showReadOnlyTip("O e-mail não pode ser alterado.")}
                            bg={colors.gray[100]}
                            borderColor={colors.blue[800]}
                            borderWidth={1}
                            borderRadius={10}
                        />
                    </FormControl>

                    <FormControl w="100%">
                        <FormControl.Label>CPF/CNPJ</FormControl.Label>
                        <Input
                            value={readOnlyFields.cpfCnpj}
                            isReadOnly
                            onFocus={() => showReadOnlyTip("O CPF/CNPJ não pode ser alterado.")}
                            bg={colors.gray[100]}
                            borderColor={colors.blue[800]}
                            borderWidth={1}
                            borderRadius={10}
                        />
                    </FormControl>

                    <FormControl w="100%">
                        <FormControl.Label>Usuário</FormControl.Label>
                        <Input
                            value={userData.userName}
                            isReadOnly
                            onFocus={() => showReadOnlyTip("O nome de usuário não pode ser alterado.")}
                            bg={colors.gray[100]}
                            borderColor={colors.blue[800]}
                            borderWidth={1}
                            borderRadius={10}
                        />
                    </FormControl>

                    <FormControl w="100%">
                        <SelectField
                            label="Gênero"
                            value={userData.gender}
                            onChange={(v) => setUserData({ ...userData, gender: v })}
                            options={[
                                { label: "Masculino", value: "masculino" },
                                { label: "Feminino", value: "feminino" },
                                { label: "Prefiro não informar", value: "" }
                            ]}
                        />
                    </FormControl>

                    <FormControl w="100%">
                        <DatePicker
                            label="Data de Nascimento"
                              date={
                                  new Date(userData.birthDate)
                                }
                                onChange={(d) =>
                                    setUserData({ ...userData, birthDate: d.toISOString().split("T")[0] })
                                }
                                
                                />
                    </FormControl>

                    <FormControl w="100%">
                        <SelectField
                            label="Tamanho Camiseta"
                            value={userData.tShirtSize}
                            onChange={(v) => setUserData({ ...userData, tShirtSize: v })}
                            options={[
                                { label: "Infantil - 6", value: "Infantil - 6" },
                                { label: "Infantil - 8", value: "Infantil - 8" },
                                { label: "Infantil - 10", value: "Infantil - 10" },
                                { label: "Infantil - 12", value: "Infantil - 12" },
                                { label: "Infantil - 14", value: "Infantil - 14" },
                                { label: "PP", value: "PP" },
                                { label: "P", value: "P" },
                                { label: "M", value: "M" },
                                { label: "G", value: "G" },
                                { label: "GG", value: "GG" },
                                { label: "XG", value: "XG" },
                                { label: "XXG", value: "XXG" },
                            ]}
                        />
                    </FormControl>

                    <FormControl w="100%">
                        <FormControl.Label>Instagram</FormControl.Label>
                        <Input
                            value={userData.instagramPage}
                            onChangeText={(v) => setUserData({ ...userData, instagramPage: v })}
                            bg={colors.gray[100]}
                            borderColor={colors.blue[800]}
                            borderWidth={1}
                            borderRadius={10}
                        />
                    </FormControl>

                    <Button
                        mt={4}
                        w="100%"
                        bg={colors.blue[500]}
                        borderRadius={20}
                        isLoading={loading}
                        onPress={handleUpdate}
                    >
                        <Text fontSize={fontSizes.md} color={colors.white} fontWeight="bold">
                            Salvar Alterações
                        </Text>
                    </Button>

                    <Button
                        mt={4}
                        variant="ghost"
                        _text={{ color: colors.black, fontFamily: "Montserrat", textDecorationLine: "underline" }}
                        onPress={() => 
                            {
                                AsyncStorage.getItem("userType").then((userType) => {
                                    if (userType === "1"){
                                        navigation.navigate("HomePlayer" as never);
                                    }
                                    if (userType === "2"){
                                        navigation.navigate("HomeAdm" as never);
                                    }
                                });
                            }}
                    >
                        Voltar
                    </Button>
                </VStack>
            </ScrollView>

            <GenericModal
                isOpen={modalVisible}
                onClose={handleModalClose}
                title={modalType === "success" ? "Sucesso" : "Erro"}
                body={<Text textAlign="center" color="gray.700">{modalMessage}</Text>}
                confirmText="Fechar"
                onConfirm={handleModalClose}
                type={modalType}
                variant={modalType === "success" || modalType === "error" ? modalType : "info"}
            />
        </KeyboardAvoidingView>
    );
}
