import {useParams} from "react-router-dom";
import dayjs, {Dayjs} from 'dayjs';
import {Header} from "../../component/header";
import {Invoice} from "../../component/invoice";
import {checkUser, getLinkToken, getProduct, getUser, processAttached, processNotAttached, Product} from "../../api";
import React, {ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {Backdrop, Box, Dialog, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {Button} from "../../component/button";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {getStates} from "../../api/StatesApi";

const EMAIL_REGEXP = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const POSTAL_CODE_REGEXP = /\d{5,}/
const SSN_REGEXP = /\d{9}/
const MIN_DOB = '1980-01-01';

interface UserInfoFormProps {
    onSubmit: (
        firstName: string,
        lastName: string,
        email: string,
        address: string,
        city: string,
        state: string,
        postalCode: string,
        dateOfBirth: string,
        ssn: string,
    ) => void
}

interface Validation {
    firstName: boolean,
    lastName: boolean,
    email: boolean,
    address: boolean,
    city: boolean,
    state: boolean,
    dob: boolean,
    postalCode: boolean,
    ssn: boolean
}

const UserInfoForm: React.FC<UserInfoFormProps> = (props) => {
    const DEFAULT_DOB = dayjs('1970-01-01');

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const [state, setState] = useState<string>('')
    const [postalCode, setPostalCode] = useState<string>('')
    const [dateOfBirth, setDateOfBirth] = useState<Dayjs>(DEFAULT_DOB)
    const [ssn, setSsn] = useState<string>('')


    const [validation, setValidation] = useState<Validation>({
        firstName: false,
        lastName: false,
        email: false,
        address: false,
        city: false,
        state: false,
        dob: false,
        postalCode: false,
        ssn: false,
    })

    const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false)

    const mountRef = useRef<boolean>(false);

    const [states, setStates] = useState<string[]>([]);

    const statesMemo = useMemo(() => {
        if (!mountRef.current) {
            getStates().then(newStates => {
                setStates(newStates)
            })
        }
        return states
    }, [states])

    useEffect(() => {
        if (mountRef.current) {
            const isAllValid = validation.firstName
                && validation.lastName
                && validation.email
                && validation.address
                && validation.city
                && validation.state
                && validation.dob
                && validation.postalCode
                && validation.ssn
            setButtonDisabled(!isAllValid)
            return
        }

        mountRef.current = true
    }, [validation])

    return (
        <Box
            component="form"
            autoComplete={'off'}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: '30vw',
                padding: '16px 24px',
                gap: '16px'
            }}>
            <TextField
                id="firstName"
                label="First name"
                value={firstName}
                variant="outlined"
                error={!validation.firstName}
                onChange={(it) => {
                    const value = it.target.value;
                    setFirstName(value)
                    setValidation(state => {
                        return {
                            ...state,
                            firstName: value.length !== 0,
                        }
                    })
                }}
            />
            <TextField
                id="lastName"
                label="Last name"
                variant="outlined"
                value={lastName}
                error={!validation.lastName}
                onChange={(it) => {
                    const value = it.target.value;
                    setLastName(value)
                    setValidation(state => {
                        return {
                            ...state,
                            lastName: value.length !== 0,
                        }
                    })
                }}
            />
            <TextField
                id="email"
                label="Email"
                variant="outlined"
                value={email}
                error={!validation.email}
                helperText={'john@doe.com'}
                onChange={(it) => {
                    const value = it.target.value;
                    setEmail(value)
                    setValidation(state => {
                        return {
                            ...state,
                            email: EMAIL_REGEXP.test(value),
                        }
                    })
                }}
            />
            <TextField
                id="address"
                label="Address"
                variant="outlined"
                error={!validation.address}
                helperText={'99-99 33rd St'}
                value={address}
                onChange={(it) => {
                    const value = it.target.value;
                    setAddress(value)
                    setValidation(state => {
                        return {
                            ...state,
                            address: value.length !== 0,
                        }
                    })
                }}
            />
            <TextField
                id="city"
                label="City"
                error={!validation.city}
                variant="outlined"
                helperText={'New York'}
                value={city}
                onChange={(it) => {
                    const value = it.target.value;
                    setCity(value)
                    setValidation(state => {
                        return {
                            ...state,
                            city: value.length !== 0,
                        }
                    })
                }}
            />
            <FormControl>
                <InputLabel id="state-select-label">State</InputLabel>
                <Select
                    error={!validation.state}
                    variant={'outlined'}
                    labelId="state-select-label"
                    id="state-select"
                    value={state}
                    label="State"
                    onChange={(it) => {
                        const value = it.target.value;
                        setValidation(state => {
                            return {
                                ...state,
                                state: value.length !== 0,
                            }
                        })
                        setState(it.target.value)
                    }}
                >
                    {statesMemo.map(it => (<MenuItem value={it}>{it}</MenuItem>))}
                </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label={'Date of birth'}
                    disableFuture={true}
                    defaultValue={dayjs()}
                    value={dateOfBirth}
                    minDate={dayjs(MIN_DOB)}
                    onChange={(newValue) => {
                        setValidation(state => {
                            return {
                                ...state,
                                dob: !!newValue,
                            }
                        })
                        setDateOfBirth(newValue!!)
                    }}/>
            </LocalizationProvider>
            <TextField
                error={!validation.postalCode}
                inputProps={{inputMode: 'numeric', pattern: POSTAL_CODE_REGEXP}}
                id="zip"
                label="Postal code"
                variant="outlined"
                value={postalCode}
                helperText={'11101'}
                onChange={(it) => {
                    const value = it.target.value;
                    setPostalCode(value)
                    setValidation(state => {
                        return {
                            ...state,
                            postalCode: POSTAL_CODE_REGEXP.test(value),
                        }
                    })
                }}
            />
            <TextField
                error={!validation.ssn}
                inputProps={{inputMode: 'numeric', pattern: SSN_REGEXP}}
                id="ssn"
                label="SSN"
                variant="outlined"
                helperText={'123456789'}
                value={ssn}
                onChange={(it) => {
                    const value = it.target.value;
                    setSsn(value)
                    setValidation(state => {
                        return {
                            ...state,
                            ssn: SSN_REGEXP.test(value),
                        }
                    })
                }}
            />
            <Button
                disabled={isButtonDisabled}
                onClick={() => {
                    props.onSubmit(
                        firstName,
                        lastName,
                        email,
                        address,
                        city,
                        state,
                        postalCode,
                        dateOfBirth.format('YYYY-MM-DD'),
                        ssn
                    )
                }} children={'Confirm'}></Button>
        </Box>
    )
}

interface UserInfoDialogProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    children: ReactNode
}

const UserInfoDialog: React.FC<UserInfoDialogProps> = ({open, setOpen, children}) => (
    <Dialog open={open} onClose={() => setOpen(false)}>
        {children}
    </Dialog>
)
export const Payment = () => {

    const [product, setProduct] = useState<Product>()
    const [userInfoFormOpen, setUserInfoFormOpen] = useState(false)
    const [backdropOpen, setBackdropOpen] = useState(false)

    const {id} = useParams()

    const mount = useRef(false)
    useEffect(() => {
        if (!mount.current) {
            mount.current = true
            getProduct(id!!)
                .then(it => setProduct(it))
        }
    }, [id, product])

    const handleSuccessTransaction = (transactionId: string) => {
        alert(`Successfully created transaction with id ${transactionId}`)
        setUserInfoFormOpen(false)
        setBackdropOpen(false)
    }

    const handleSubmit = (
        firstName: string,
        lastName: string,
        email: string,
        address: string,
        city: string,
        state: string,
        postalCode: string,
        dateOfBirth: string,
        ssn: string,
    ) => {
        setBackdropOpen(true)
        getUser(
            firstName,
            lastName,
            email,
            address,
            city,
            state,
            postalCode,
            dateOfBirth,
            ssn
        ).then(user => {
            if (user.isFundingAttached) processAttached(id!!).then(transactionId => handleSuccessTransaction(transactionId))
            else getLinkToken(user.id)
                .then(token => {
                    // @ts-ignore
                    window.Plaid.create({
                        token: token,
                        onSuccess: (publicToken: string, metadata: Object) => {
                            // @ts-ignore
                            processNotAttached(user.id, publicToken, metadata.account_id, id)
                                .then(transactionId => handleSuccessTransaction(transactionId))
                                .catch((e) => {
                                    console.log(e)
                                    alert(`Failed to create transaction`)
                                    setUserInfoFormOpen(false)
                                    setBackdropOpen(false)
                                })
                        },
                    }).open()
                })
        }).catch(e => {
            alert("Something went wrong")
            console.log(e)
        })
    }

    return (<>
            <UserInfoDialog open={userInfoFormOpen} setOpen={setUserInfoFormOpen}>
                <DialogTitle>Set account</DialogTitle>
                <UserInfoForm onSubmit={handleSubmit}/>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={backdropOpen}
                    onClick={() => {
                    }}
                />
            </UserInfoDialog>
            <div style={{
                minHeight: '100vh',
                minWidth: '100vw',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Header/>
                <div style={{
                    display: 'flex',
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '10vh'
                }}>
                    <Invoice
                        isRecurring={product?.isRecurring || false}
                        title={(<h1>{product?.name || ''}</h1>)}
                        description={product?.description || ''}
                        price={product?.price || ''}
                        onButtonClick={() => {
                            checkUser().then(r => {
                                if (r) {
                                    processAttached(id!!).then(transactionId => handleSuccessTransaction(transactionId))
                                } else {
                                    setUserInfoFormOpen(true)
                                }
                            })
                        }}
                    />
                </div>
            </div>
        </>
    )
}
