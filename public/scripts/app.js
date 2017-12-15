// Account { balance, bills[], paychecks[] }
// Bill { amount, date }
// Paycheck { amount, date }
// Real Balance { }

let accounts = [
    {id: 1, bank: "Chase", type: 'Checking' },
    {id: 2, bank: "Provident Credit Union", type: 'Checking' }
];

const Account = (props) => (
    <div className="comment">
        <h2 className="commentAuthor">
            { props.bank }
        </h2>
        { props.children }
    </div>
);

const AccountList = function (props, context) {
    return (
    <div className="commentList">
        { props.accounts.map(account => (
            <Account bank={ account.bank } key={account.id} >
                { account.type }
            </Account>
        )) }
    </div>
);};

const AccountForm = (props) => (
    <form className="commentForm"
          onSubmit={ (e) => {
              e.preventDefault();
              props.onAccountSubmit();
          }}
    >
        <input type="text"
               name="bank"
               placeholder="Name of Bank"
               value={ props.bank }
               onChange={ (e) =>
                   props.onBankChange(e.target.value) }

        />
        <input type="text"
               name="type"
               placeholder="Account Type"
               value={ props.type }
               onChange={ (e) =>
                   props.onTypeChange(e.target.value) }
        />
        <button>Add</button>
    </form>
);

const { createClass, PropTypes } = React;
const AccountBox = createClass({
    contextTypes: {
        store: PropTypes.object
    },
    componentDidMount() {
        const { store } = this.context;
        this.unsubscribe = store.subscribe( () => this.forceUpdate() )
    },
    componentWillUnmount() {
        this.unsubscribe();
    },
    render() {
        const { items, bank, type } = this.context.store.getState();
        return (
            <div className="commentBox">
                <h1>Accounts</h1>
                <AccountList accounts={ items } />
                <AccountForm
                    bank={ bank }
                    type={ type }

                    onAccountSubmit={ () =>
                        dispatch(addAccount({bank, type})) }

                    onBankChange={ (bank) =>
                        dispatch(bankChange(bank)) }

                    onTypeChange={ (type) =>
                        dispatch(typeChange(type)) }
                />
            </div>
        );
    }
});

const actions = {
    ADD_ACCOUNT:    Symbol('ADD_ACCOUNT'),
    BANK_CHANGE:  Symbol('BANK_CHANGE'),
    TYPE_CHANGE:     Symbol('TYPE_CHANGE')
};

const addAccount = (account) => ({
    type: actions.ADD_ACCOUNT,
    account
});

const bankChange = (bank) => ({
    type: actions.BANK_CHANGE,
    bank
});

const typeChange = (type) => ({
    type: actions.TYPE_CHANGE,
    type
});

const accountsReducer = (state={
    items:[],
    bank:'',
    type: ''
}, action) => {
    switch (action.type) {
        case actions.ADD_ACCOUNT:
        return {
            ...state,
            items: [...state.items, {id: Math.random(), ...action.account}]
        };

        case actions.BANK_CHANGE:
        return {
            ...state,
            bank: action.bank
        };

        case actions.TYPE_CHANGE:
        return {
            ...state,
            type: action.type
        };

        default:
        return state;

    }
};

const { createStore } = Redux;
const store = createStore(accountsReducer);
const { getState, dispatch } = store;
accounts.map(account => dispatch( addAccount(account) ));
console.log(getState());

const { Provider } = ReactRedux;
ReactDOM.render(
    <Provider store={ store }>
        <AccountBox />
    </Provider>,
    document.querySelector('#content')
);
