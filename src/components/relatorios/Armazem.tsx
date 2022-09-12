import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
    Image

} from "@react-pdf/renderer";

import logo from '../../assets/noah.png'

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
    viewer: {
        width: window.innerWidth, //the pdf viewer will take up all of the width and height
        height: window.innerHeight,
        zIndex: 0
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
        borderWidth: 1,
    },
    assinaturas: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 55,
        fontSize: '10px',
        paddingHorizontal: '45px'
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

type EquipamentosARMType = {
    id: number;
    quantidade: number;
    equipamento_id: EquipamentoType;
    data_aquisicao: string
}
type DuracaoType = {
    id: number;
    tempo: string;

}
type ClassificacaoType = {
    id: number;
    tipo: string;

}

type PosicaoArmazemProps = {
    equipamentosARM: EquipamentosARMType[];

}

// Create Document Component
export default function BasicDocument({ equipamentosARM }: PosicaoArmazemProps) {



    return (
        <PDFViewer style={styles.viewer}>
            {/* Start of the document*/}
            <Document title="Relatório de Equipamentos em armazem">
                {/*render a single page*/}
                <Page size="A4" style={styles.page} wrap>


                    <View style={styles.fotoTitulo}>
                        <Image style={styles.logo} src="https://img.icons8.com/android/96/000000/phone.png" />
                        <Text>NOAH CONSTUCTIONS</Text>
                    </View>

                    <View style={styles.titulo}>
                        <Text>RELATÓRIO DE EQUIPAMENTOS EM ARMAZEM DO DIA 12-09-2022</Text>
                    </View>

                    <View style={styles.cabecalho}>

                        <View style={styles.section}>
                            <Text style={styles.textoTitulo}>Descrição</Text>
                        </View>

                        <View style={styles.section}>
                            <Text>Classificação</Text>
                        </View>
                        <View style={styles.section}>
                            <Text>Tempo de duração</Text>
                        </View>


                        <View style={styles.section}>
                            <Text>Quantidade</Text>
                        </View>


                    </View>

                    {
                        equipamentosARM && equipamentosARM.map((armazem, index) => (
                            <View style={styles.corpo} key={index}>

                                <View style={styles.section}>
                                    <Text>{armazem.equipamento_id.descricao}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text>{armazem.equipamento_id.classificacao_id}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text>{armazem.equipamento_id.duracao_id}</Text>
                                </View>


                                <View style={styles.section}>
                                    <Text>{armazem.quantidade}</Text>
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
                        <Text>Luanda aos, 12-09-2022</Text>
                    </View>


                </Page>
            </Document>
        </PDFViewer>
    );
}