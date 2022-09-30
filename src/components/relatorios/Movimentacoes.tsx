import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
    Image
} from "@react-pdf/renderer";

import moment from 'moment'
// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: "#ffff",
        color: "black",
        padding: 30
    },
    section: {
        paddingHorizontal: 2,
        borderColor: '#f6f6f',
        width: '30%',
        fontSize: '8px',
        textAlign: 'center'
    },
    total: {
        color: '#cd1212'
    },
    viewer: {
        width: window.innerWidth, //the pdf viewer will take up all of the width and height
        height: window.innerHeight,

    },
    cabecalho: {
        backgroundColor: '#D3D3D3',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderBottomWidth: '0.5px',
        borderTopWidth: '0.5px',
        textAlign: 'center',
        marginBottom: 5,
        fontWeight: 'extrabold',
        fontSize: '10px'
    },
    corpo: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10px',
        padding: 5,
        borderBottomWidth: '0.5px',
        fontWeight: 'light',
        borderWidth: '1px',
        borderRadius: '5px'
    },
    titulo: {
        fontWeight: 'ultrabold',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        paddingTop: 15,
        paddingBottom: 4,
        fontSize: '12px',
        borderTop: '0.5px',
        textAlign: 'center'
    },
    logo: {
        width: 74,
        height: 40,
    },
    assinaturas: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 75,
        fontSize: '10px',
        paddingHorizontal: '20px'
    },
    assinaturaIndividual: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderTop: 1
    },
    textoTitulo: {
        fontWeight: 'bold'
    },
    fotoTitulo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '8px'
    },
    rodape: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '8px',
        paddingTop: '35px'
    }

});

type EquipamentoType = {
    id: number;
    descricao: string;
    duracao_id: number;
    classificacao_id: number;
    data: string
}

type ObraType = {
    id: number
    obra_nome: string;
    encarregado_id: number;
    estado: 'Activa' | 'Inactiva' | 'Concluida'
}

type AuditoriaType = {
    id: number;
    equipamento_id: EquipamentoType;
    obra_id: ObraType;
    data_retirada: string;
    quantidade_retirada: number;
    data_devolucao: string;
    quantidade_devolvida: number;
    estado: string
}
type AuditoriaProps = {
    auditoria: AuditoriaType[];

}
// Create Document Component

export default function BasicDocument({ auditoria }: AuditoriaProps) {
    const data = moment().format("DD/MM/yyyy")
    return (
        <PDFViewer style={styles.viewer} >
            {/* Start of the document*/}
            <Document title="Relatório de Movimentações">
                {/*render a single page*/}
                <Page size="A4" style={styles.page} >

                    <View style={styles.fotoTitulo}>
                        <Image style={styles.logo} src="https://i.ibb.co/ZJpGsHm/noah.png" />
                        <Text>NOAH CONSTUCTIONS</Text>
                    </View>

                    <View style={styles.titulo}>
                        <Text>RELATÓRIO DE MOV. DE EQUIP. NOS ALMOXARIFADOS </Text>
                    </View>

                    <View style={styles.cabecalho}>

                        <View style={styles.section}>
                            <Text style={styles.textoTitulo}>Descrição</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.textoTitulo}>Estado</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.textoTitulo}>Almoxarifado</Text>
                        </View>
                        <View style={styles.section}>
                            <Text>Qtd. recebida</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>Qtd. Devolvida</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>Data Receb.</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>Data Devol.</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>Total em Almox.</Text>
                        </View>

                    </View>
                    {
                        auditoria && auditoria.map((mov, index) => (
                            <View style={styles.corpo} key={index}>

                                <View style={styles.section}>
                                    <Text>{mov.equipamento_id.descricao}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text>{mov.estado}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text>{mov.obra_id.obra_nome}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text>{mov.quantidade_retirada}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text>{mov.quantidade_devolvida}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text>{mov.data_retirada}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text>{mov.data_devolucao}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.total}>{mov.quantidade_retirada - mov.quantidade_devolvida}</Text>
                                </View>

                            </View>
                        ))
                    }

                    <View style={styles.assinaturas}>

                        <View>
                            <Text style={styles.assinaturaIndividual}>Responsável do Armazem</Text>
                        </View>

                        <View>
                            <Text style={styles.assinaturaIndividual}>Director NOAH</Text>
                        </View>
                    </View>

                    <View style={styles.rodape}>
                        <Text>Luanda aos, {data}</Text>
                    </View>


                </Page>
            </Document>

        </PDFViewer>
    );
}
