import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Product from '../ProductManagement/Product';
import { config, baseUrl2 } from '../../types';
import axios from 'axios';
import { toast } from 'react-toastify';

const styles = theme => ({
    root: {
        width: '90%',
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    backButton: {
        marginRight: theme.spacing.unit,
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
});



class Workflow extends React.Component {
    state = {
        activeStep: 0,
        completed: new Set(),
        skipped: new Set(),
        barcode: '',
        challan: ''
    };

    getSteps = () => {
        return ['Count Boxes', 'Compare Product', 'Check Challan Quantity', 'Quantity on Challan'];
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state);
    }

    handleChallan = (e) => {
        e.preventDefault();
        let data = {
            "orderId": this.state.barcode,
            "on_delivery_challan": this.state.challan
        }
        console.log(this.state);
        axios.post(`${baseUrl2}/aws/trackingProducts`, data, config)
            .then(res => {
                console.log(data);
                console.log(res);
                if (res.data.code === 200) {
                    this.setState({ details: res.data.data });
                    toast.success(res.data.message);
                }
                else {
                    toast.warn(res.data.message);
                }
            })
            .catch(err => {
                toast.error(err.message);
            })
    }

    getStepContent = (step) => {
        switch (step) {
            case 0:
                return 'Step 1: Count the number of Boxes';
            case 1:
                return 'Step 2: Compare the Product';
            case 2:
                return (
                    <div>
                        <br />
                        <Product />
                    </div>
                );
            case 3:
                return (
                    <div>
                        <br />
                        <form onSubmit={this.handleChallan}>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">ORDER ID: </span>
                                </div>
                                <input type="text" name="barcode" value={this.state.barcode} className="form-control" placeholder="Order Id" aria-label="Username" onChange={this.handleChange} aria-describedby="basic-addon1" />
                            </div>

                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">ON DELIVERY CHALLAN: </span>
                                </div>
                                <input type="text" name="challan" value={this.state.challan} className="form-control" placeholder="Challan Quantity" aria-label="Username" onChange={this.handleChange} aria-describedby="basic-addon1" />
                            </div>

                            <button type="sumbit" className="btn btn-success">Save</button>
                        </form>
                        <br/><br/>
                    </div>
                );
            default:
                return 'Unknown step';
        }
    }

    totalSteps = () => {
        return this.getSteps().length;
    };

    isStepOptional = step => {
        return step === 1;
    };

    handleSkip = () => {
        const { activeStep } = this.state;
        if (!this.isStepOptional(activeStep)) {
            // You probably want to guard against something like this
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        this.setState(state => {
            const skipped = new Set(state.skipped.values());
            skipped.add(activeStep);
            return {
                activeStep: state.activeStep + 1,
                skipped,
            };
        });
    };

    handleNext = () => {
        let activeStep;

        if (this.isLastStep() && !this.allStepsCompleted()) {
            // It's the last step, but not all steps have been completed
            // find the first step that has been completed
            const steps = this.getSteps();
            activeStep = steps.findIndex((step, i) => !this.state.completed.has(i));
        } else {
            activeStep = this.state.activeStep + 1;
        }
        this.setState({
            activeStep,
        });
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleStep = step => () => {
        this.setState({
            activeStep: step,
        });
    };

    handleComplete = () => {
        // eslint-disable-next-line react/no-access-state-in-setstate
        const completed = new Set(this.state.completed);
        completed.add(this.state.activeStep);
        this.setState({
            completed,
        });

        /**
         * Sigh... it would be much nicer to replace the following if conditional with
         * `if (!this.allStepsComplete())` however state is not set when we do this,
         * thus we have to resort to not being very DRY.
         */
        if (completed.size !== this.totalSteps() - this.skippedSteps()) {
            this.handleNext();
        }
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
            completed: new Set(),
            skipped: new Set(),
        });
    };

    skippedSteps() {
        return this.state.skipped.size;
    }

    isStepSkipped(step) {
        return this.state.skipped.has(step);
    }

    isStepComplete(step) {
        return this.state.completed.has(step);
    }

    completedSteps() {
        return this.state.completed.size;
    }

    allStepsCompleted() {
        return this.completedSteps() === this.totalSteps() - this.skippedSteps();
    }

    isLastStep() {
        return this.state.activeStep === this.totalSteps() - 1;
    }

    render() {
        const { classes } = this.props;
        const steps = this.getSteps();
        const { activeStep } = this.state;

        return (
            <div className="container text-center center">
                <Stepper alternativeLabel nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const props = {};
                        const buttonProps = {};
                        if (this.isStepOptional(index)) {
                            buttonProps.optional = <Typography variant="caption">Optional</Typography>
                        }
                        if (this.isStepSkipped(index)) {
                            props.completed = false;
                        }
                        return (
                            <Step key={label} {...props}>
                                <StepButton
                                    onClick={this.handleStep(index)}
                                    completed={this.isStepComplete(index)}
                                    {...buttonProps}
                                >
                                    {label}
                                </StepButton>
                            </Step>
                        );
                    })}
                </Stepper>
                <div>
                    {this.allStepsCompleted() ? (
                        <div>
                            <Typography className={classes.instructions}>
                                All steps completed - you&quot;re finished
                            </Typography>
                            <Button onClick={this.handleReset}>Reset</Button>
                        </div>
                    ) : (
                            <div>
                                <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
                                <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={this.handleBack}
                                        className={classes.button}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleNext}
                                        className={classes.button}
                                    >
                                        Next
                                    </Button>
                                    {this.isStepOptional(activeStep) &&
                                        !this.state.completed.has(this.state.activeStep) && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.handleSkip}
                                                className={classes.button}
                                            >
                                                Skip
                                            </Button>
                                        )}
                                    {activeStep !== steps.length &&
                                        (this.state.completed.has(this.state.activeStep) ? (
                                            <Typography variant="caption" className={classes.completed}>
                                                Step {activeStep + 1} already completed
                                            </Typography>
                                        ) : (
                                                <Button variant="contained" color="primary" onClick={this.handleComplete}>
                                                    {this.completedSteps() === this.totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                                                </Button>
                                            ))}
                                </div>
                            </div>
                        )}
                </div>
            </div>
        );
    }
}

Workflow.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Workflow);