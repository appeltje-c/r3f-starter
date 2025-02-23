import { create } from 'zustand'
import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Grid2 as Grid, Slider, TextField } from '@mui/material'
import { immer } from 'zustand/middleware/immer'

let tweaksInitialized = false

interface DynamicState {
    [key: string]: any
}

interface DynamicStore {
    state: DynamicState
    setProperty: (key: string, value: any) => void
    setValue: (key: string, value: any) => void
}

const useDynamicStore = create<DynamicStore>()(immer((set) => ({
    state: {},
    setProperty: (key, value) =>
        set((state) => ({
            state: {
                ...state.state,
                [key]: value,
            },
        })),
    setValue: (key: string, value: any) => set((state) => {
        state.state[key].value = value
    })
})))

export const useTweaks = (initialValues: DynamicState) => {

    const { state, setProperty } = useDynamicStore()

    useEffect(() => {

        Object.keys(initialValues).forEach((key) => {
            setProperty(key, initialValues[key])
        })

    }, [])

    const values = Object.keys(initialValues).reduce((acc, key) => {
        acc[key] = state[key] ? state[key].value : undefined
        return acc
    }, {} as DynamicState)

    renderTweaks()

    return values
}

const RenderNumber = ({ stateKey }: { stateKey: string }) => {

    const { state, setValue } = useDynamicStore()

    // check for array Vector3 and Vector2


    if (state[stateKey].hasOwnProperty('min') && state[stateKey].hasOwnProperty('max')) {

        return (
            <>
                <Slider
                    size='small'
                    value={state[stateKey].value}
                    onChange={(_, newValue) => setValue(stateKey, newValue)}
                    step={state[stateKey].hasOwnProperty('step') ? state[stateKey].step : 1}
                    min={state[stateKey].min}
                    max={state[stateKey].max} />
                <span>{state[stateKey].value}</span>
            </>
        )
    }

    return (
        <TextField
            type='number'
            value={state[stateKey].value}
            sx={{ width: 100 }}
            onChange={event => setValue(stateKey, Number(event.target.value))}
            size="small" />
    )
}

const isColor = (strColor: string) => {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== '';
}

const RenderString = ({ stateKey }: { stateKey: string }) => {

    const { state, setValue } = useDynamicStore()

    if (isColor(state[stateKey].value)) {

        return (
            <input
                type="color"
                value={state[stateKey].value}
                onChange={(event) => setValue(stateKey, event.target.value)} />
        )
    }

    return (
        <TextField
            value={state[stateKey].value}
            sx={{ width: 100 }}
            onChange={event => setValue(stateKey, event.target.value)}
            size="small" />
    )
}


const Tweaks = () => {

    const { state } = useDynamicStore()

    return (
        <Grid style={{ position: 'absolute', zIndex: 100000, top: 10, right: 10 }}>
            {
                Object.keys(state).map(key => {
                    const type = typeof state[key].value
                    return (
                        <Grid size={12} key={key}>
                            {type === 'number' && <RenderNumber stateKey={key} />}
                            {type === 'string' && <RenderString stateKey={key} />}
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}

const renderTweaks = () => {

    useEffect(() => {

        if (!tweaksInitialized) {
            let domNode = document.getElementById('tweak__tools')
            if (!domNode) {
                domNode = document.createElement('div')
                domNode.id = 'tweak__tools'
                document.body.appendChild(domNode)
            }

            const root = createRoot(domNode)
            root.render(<Tweaks />)
            tweaksInitialized = true
        }
    }, [])
}