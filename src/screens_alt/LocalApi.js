import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View, TextInput } from "react-native";

const Item = ({ name, email, bidang, imageUrl }) => {
    return (
        <View style={styles.itemContainer}>
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
                <View style={styles.imagePlaceholder} />
            )}
            <View style={styles.desc}>
                <Text style={styles.descName}>{name}</Text>
                <Text style={styles.descEmail}>{email}</Text>
                <Text style={styles.descBidang}>{bidang}</Text>
            </View>
        </View>
    );
};

const LocalApi = () => {
    // postdata
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bidang, setBidang] = useState("");
    // getdata
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const Submit = () => {
        const data = {
            name,
            email,
            bidang,
        };
        console.log('data before send: ', data);
        axios
            .post('http://172.16.100.81:3004/users', data)
            .then((res) => {
                console.log('res: ', res);
                setName("");
                setEmail("");
                setBidang("");
                getData();
            })
            .catch((err) => {
                console.error('Error posting data:', err);
            });
    };

    const getData = () => {
        setLoading(true);
        axios
            .get('http://172.16.100.81:3004/users')
            .then((res) => {
                console.log('res get data: ', res);
                setUsers(res.data);
            })
            .catch((err) => {
                console.error('Error getting data:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>Form Pengguna</Text>

            <TextInput
                placeholder="Nama Lengkap"
                style={styles.input}
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Bidang"
                style={styles.input}
                value={bidang}
                onChangeText={(text) => setBidang(text)}
            />

            <Button title="Simpan" onPress={Submit} />
            <View style={styles.line} />

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                users.map((user) => {
                    return (
                        <Item
                            key={user.id}
                            name={user.name}
                            email={user.email}
                            bidang={user.bidang}
                            imageUrl={user.imageUrl} // jika ada imageUrl pada API
                        />
                    );
                })
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    textTitle: { textAlign: 'center', marginBottom: 20 },
    line: { height: 2, backgroundColor: 'black', marginVertical: 20 },
    input: { borderWidth: 1, marginBottom: 12, borderRadius: 25, paddingHorizontal: 18 },
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    imagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ccc',
        marginRight: 10,
    },
    desc: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    descName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    descEmail: {
        fontSize: 14,
    },
    descBidang: {
        fontSize: 12,
        color: '#666',
    },
});

export default LocalApi;
