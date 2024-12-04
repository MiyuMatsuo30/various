import { Box, Button, Container, TextField, Paper, CircularProgress } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import axios from 'axios';
import { color, lightColor } from '../hooks/ColorPalete';
import { gets, items } from '../hooks/WordsApiResults';

// Words API呼び出し
const WordsApi = async (word: string) => {
    const options = {
        method: 'GET',
        url: `https://wordsapiv1.p.rapidapi.com/words/${word}`,
        headers: {
            'x-rapidapi-key': '2b74b698b7msh54cf0f18eeff0c2p1b1cf1jsn257225d28e8e',
            'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com'
        }
    };
    try {
        const response = await axios.request(options);
        const data = response.data.results
        return data;
    } catch (error) {
        console.error(error);
        alert("見つかりませんでした。")
    }
}

// Paperのスタイル(ダークモード込み)
const Item = styled(Paper)(({ theme }) => ({
    backGroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: "#1A2027",
    }),
}));

type wordRes = [{definition: string|[], synonyms: string|[]}]

const WordDict = () => {
    const [word, setWord] = useState("");
    const [loading, setLoading] = useState(true);
    const handleChangeWord = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWord(event.currentTarget.value);
    }
    const [wordResult, setWordResult] = useState<wordRes|string|undefined>()
    const handleSetResult = async () => {
        if (word !== "") {
            const result = await WordsApi(word);
            setWordResult(result);
        } else {
            setWordResult("見つかりませんでした。");
        }
    }
    const handleSetLoading = (e: boolean) => {setLoading(e)}
    const ShowItems = ({res}) => {
        return (
            gets.map((getName, gKey) => (
            res[getName] && (<Grid2 
                key={gKey}
                container
                direction="row"
                sx={{
                    padding: 1,
                    justifyContent: "left",
                    alignItems: "center",
                }}
            >
                <Grid2 sx={[
                    (theme) => ({
                        color: color[gKey], 
                        ...theme.applyStyles('dark', {color: lightColor[gKey]}), 
                        width: 1/7, 
                        fontSize: 20})
                    ]}
                >{items[getName]}</Grid2>
                <Grid2 sx={[
                    (theme) => ({
                        color: color[gKey], 
                        ...theme.applyStyles('dark', {color: lightColor[gKey]}), 
                        width: 6/7, 
                        fontSize: 16})
                    ]}
                >{ typeof res[getName] == 'object' ? 
                res[getName].map((value: string, key: number) => (key === res[getName].length-1 ? value : `${value} / `)) 
                : res[getName] }</Grid2>
            </Grid2>)
        )))
    }
    const Result = () => {
        if( typeof wordResult === "string" ) {
            return (<Grid2>{wordResult}</Grid2>)
        } else if ( typeof wordResult !== "undefined" ) {
            setLoading(true);
            return (
                <Grid2 
                    container 
                    direction="column"
                    sx={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                    }}
                    spacing={2}>
                    {wordResult.map((res, key) => (
                        <Box sx={{ width: 1/1 }} key={key}>
                            <Item >
                                <Grid2>
                                    <Grid2 sx={{color: 'black'}}>{key+1}.</Grid2>
                                </Grid2>
                                <ShowItems res={res} />
                            </Item>
                        </Box>
                    ))}
                </Grid2>
            )
        } else {
            return (<Grid2>英単語を入力してください。</Grid2>)
        }
    }

    return (
        <Container>
            <Grid2 container>
                <h1>英英辞典</h1>
            </Grid2>
            <Grid2 container sx={{paddingBottom: 5}}>
                <Grid2>
                    <TextField
                        id="search-area"
                        placeholder="word"
                        value={word}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChangeWord(event);}}
                    />
                </Grid2>
                <Grid2 sx={{paddingLeft:1}}>
                    <Button
                        sx={{textAlign: "flex", height: 1, width: 1}}
                        variant="contained"
                        onClick={() => {handleSetResult(); handleSetLoading(false);}}
                    >調べる</Button>
                </Grid2>
            </Grid2>
            {wordResult || loading ? <Result /> : <CircularProgress />}
        </Container>
    )
}

export default WordDict;