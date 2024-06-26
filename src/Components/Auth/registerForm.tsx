import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, notification } from 'antd';
import { registrationModel } from "../../Models/registrationModel";
import { REGISTER_USER_REQUEST } from "../../Actions/actions";
import { ICommonResponse } from "../../Common/commonInterfaces";
interface RegistrationFormProps {
    onSubmit: (user: registrationModel) => void;
    isSuccess: boolean;
    response: ICommonResponse
}

const RegistrationForm: React.FC<RegistrationFormProps> = (props: RegistrationFormProps) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [notificationShown, setNotificationShown] = useState(false);


    useEffect(() => {
        if (props.response && !notificationShown) {
          console.log("Response Message:", props.response.Message);
          if (props.response.Code === 200) {
            notification.success({ message: props.response.Message });
          } else {
            notification.error({ message: props.response.Message });
          }
          setNotificationShown(true);
        }
      }, [props.response, notificationShown]);


    useEffect(() => {
        if (props.isSuccess) {
            navigate("/confirmation");
        }
    }, [props.isSuccess, navigate]);
    const onFinish = (values: registrationModel) => {
        props.onSubmit(values);
        localStorage.setItem('userEmail', values.email);
        form.resetFields();

    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title="Registration" style={{ width: 400, backgroundColor: '#96bfff', borderRadius: 20 }}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[{ required: true, type: "email", message: 'Please enter your email' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password autoComplete="false" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password autoComplete="false" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    );
}
const mapStateToProps = (state: any) => {
    return {
        registrations: state.registrations.registrations,
        response: state.registrations.response,
        isSuccess: state.registrations.isSuccess,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onSubmit: (user: registrationModel) => dispatch({ type: REGISTER_USER_REQUEST, payload: user }),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);