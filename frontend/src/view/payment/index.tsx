import {useParams} from "react-router-dom";
import {Header} from "../../component/header";
import {Invoice} from "../../component/invoice";
import {checkUser, getLinkToken, getProduct, getUser, processAttached, processNotAttached, Product} from "../../api";
import React, {ReactNode, useEffect, useRef, useState} from "react";
import {Backdrop, Dialog, DialogTitle, TextField} from "@mui/material";
import {Button} from "../../component/button";

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

const UserInfoForm: React.FC<UserInfoFormProps> = (props) => {

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const [state, setState] = useState<string>('')
    const [postalCode, setPostalCode] = useState<string>('')
    const [dateOfBirth, setDateOfBirth] = useState<string>('')
    const [ssn, setSsn] = useState<string>('')

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'left',
            padding: '16px 24px',
            gap: '10px'
        }}>
            <TextField
                id="firstName"
                label="First name"
                value={firstName}
                variant="outlined"
                onChange={(it) => setFirstName(it.target.value)}
            />
            <TextField
                id="lastName"
                label="Last name"
                variant="outlined"
                value={lastName}
                onChange={(it) => setLastName(it.target.value)}
            />
            <TextField
                id="email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(it) => setEmail(it.target.value)}
            />
            <TextField
                id="address"
                label="Address"
                variant="outlined"
                value={address}
                onChange={(it) => setAddress(it.target.value)}
            />
            <TextField
                id="city"
                label="City"
                variant="outlined"
                value={city}
                onChange={(it) => setCity(it.target.value)}
            />
            <TextField
                id="state"
                label="State"
                variant="outlined"
                value={state}
                onChange={(it) => setState(it.target.value)}
            />
            <TextField
                id="dob"
                label="Date of birth"
                variant="outlined"
                value={dateOfBirth}
                onChange={(it) => setDateOfBirth(it.target.value)}
            />
            <TextField
                id="zip"
                label="Postal code"
                variant="outlined"
                value={postalCode}
                onChange={(it) => setPostalCode(it.target.value)}
            />
            <TextField
                id="ssn"
                label="SSN"
                variant="outlined"
                value={ssn}
                onChange={(it) => setSsn(it.target.value)}
            />
            <Button onClick={() => {
                props.onSubmit(
                    firstName,
                    lastName,
                    email,
                    address,
                    city,
                    state,
                    postalCode,
                    dateOfBirth,
                    ssn
                )
            }} children={'Confirm'}></Button>
        </div>
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
                                    alert(`Failed to create transaction`)
                                    setBackdropOpen(false)
                                })
                                .finally(() => setBackdropOpen(false))
                        },
                    }).open()
                })
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
