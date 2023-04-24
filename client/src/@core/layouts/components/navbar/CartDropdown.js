// ** React Imports
import { Link } from 'react-router-dom'
import { useEffect, Fragment, useState } from 'react'

// ** Third Party Components
import InputNumber from 'rc-input-number'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { ShoppingCart, X, Plus, Minus } from 'react-feather'

// ** Reactstrap Imports
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem, Badge, Button } from 'reactstrap'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getCartItems, deleteCartItem, getProduct } from '@src/views/apps/ecommerce/store'

// ** Styles
import '@styles/react/libs/input-number/input-number.scss'

const CartDropdown = () => {
  // ** State
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.ecommerce)

  // ** ComponentDidMount
  useEffect(() => {
    dispatch(getCartItems())
  }, [])

  // ** Function to toggle Dropdown
  const toggle = () => setDropdownOpen(prevState => !prevState)

  // ** Function to call on Dropdown Item Click
  const handleDropdownItemClick = id => {
    dispatch(getProduct(id))
    toggle()
  }

}

export default CartDropdown
