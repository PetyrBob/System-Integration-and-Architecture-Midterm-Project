from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Data models
class MenuItem(BaseModel):
    id: int
    name: str
    price: float  # Price in PHP

class CartItem(BaseModel):
    menu_item_id: int
    quantity: int

class Order(BaseModel):
    order_id: int
    customer_name: str
    items: List[CartItem]
    total_bill: float = 0.0  # Total bill in PHP

# In-memory "databases"
menu_db = [
    {"id": 1, "name": "Adobo", "price": 350.00},
    {"id": 2, "name": "Sinigang", "price": 385.00},
    {"id": 3, "name": "Lechon", "price": 525.00},
    {"id": 4, "name": "Pancit", "price": 290.00},
    {"id": 5, "name": "Kare-Kare", "price": 450.00},
    {"id": 6, "name": "Halo-Halo", "price": 250.00},
    {"id": 7, "name": "Lumpia", "price": 190.00},
    {"id": 8, "name": "Chicken Inasal", "price": 325.00},
    {"id": 9, "name": "Bibingka", "price": 175.00},
    {"id": 10, "name": "Tocino", "price": 275.00},
    {"id": 11, "name": "Longganisa", "price": 225.00},
    {"id": 12, "name": "Laing", "price": 275.00},
    {"id": 13, "name": "Bicol Express", "price": 340.00},
    {"id": 14, "name": "Sisig", "price": 365.00},
    {"id": 15, "name": "Dinuguan", "price": 330.00},
]

# Convert menu_db to MenuItem instances
menu_db = [MenuItem(**item) for item in menu_db]

orders_db = []  # In-memory storage for orders

# 1. Menu Management

# GET: View all menu items
@app.get("/menu/")
def get_menu():
    return menu_db

# POST: Add a new menu item
@app.post("/menu/")
def add_menu_item(item: MenuItem):
    for existing_item in menu_db:
        if existing_item.id == item.id:
            raise HTTPException(status_code=400, detail="Menu item with this ID already exists.")
    menu_db.append(item)
    return {"message": "Menu item added successfully", "item": item}

# PUT: Update a menu item completely
@app.put("/menu/{item_id}")
def update_menu_item(item_id: int, updated_item: MenuItem):
    for index, item in enumerate(menu_db):
        if item.id == item_id:
            menu_db[index] = updated_item
            return {"message": "Menu item updated successfully", "item": updated_item}
    raise HTTPException(status_code=404, detail="Menu item not found")

# PATCH: Partially update a menu item (e.g., change price)
@app.patch("/menu/{item_id}")
def partial_update_menu_item(item_id: int, update_data: dict):
    for item in menu_db:
        if item.id == item_id:
            if "name" in update_data:
                item.name = update_data["name"]
            if "price" in update_data:
                item.price = update_data["price"]
            return {"message": "Menu item partially updated", "item": item}
    raise HTTPException(status_code=404, detail="Menu item not found")

# DELETE: Remove a menu item
@app.delete("/menu/{item_id}")
def delete_menu_item(item_id: int):
    for index, item in enumerate(menu_db):
        if item.id == item_id:
            del menu_db[index]
            return {"message": "Menu item deleted successfully"}
    raise HTTPException(status_code=404, detail="Menu item not found")


# 2. Order Management

# POST: Create a new order
@app.post("/orders/")
def create_order(order: Order):
    total_bill = 0.0
    for cart_item in order.items:
        for menu_item in menu_db:
            if menu_item.id == cart_item.menu_item_id:
                total_bill += menu_item.price * cart_item.quantity
                break
        else:
            raise HTTPException(status_code=404, detail=f"Menu item with ID {cart_item.menu_item_id} not found")
    
    order.total_bill = total_bill
    orders_db.append(order)
    return {"message": "Order created successfully", "order": order}

# GET: Get all orders
@app.get("/orders/")
def get_all_orders():
    return orders_db

# GET: Get a specific order by ID
@app.get("/orders/{order_id}")
def get_order(order_id: int):
    for order in orders_db:
        if order.order_id == order_id:
            return order
    raise HTTPException(status_code=404, detail="Order not found")

# PUT: Update an existing order completely (replace all items)
@app.put("/orders/{order_id}")
def update_order(order_id: int, updated_order: Order):
    for index, order in enumerate(orders_db):
        if order.order_id == order_id:
            total_bill = 0.0
            for cart_item in updated_order.items:
                for menu_item in menu_db:
                    if menu_item.id == cart_item.menu_item_id:
                        total_bill += menu_item.price * cart_item.quantity
                        break
                else:
                    raise HTTPException(status_code=404, detail=f"Menu item with ID {cart_item.menu_item_id} not found")
            updated_order.total_bill = total_bill
            orders_db[index] = updated_order
            return {"message": "Order updated successfully", "order": updated_order}
    raise HTTPException(status_code=404, detail="Order not found")

# PATCH: Partially update an order (e.g., update quantity of a cart item)
@app.patch("/orders/{order_id}")
def partial_update_order(order_id: int, update_data: dict):
    for order in orders_db:
        if order.order_id == order_id:
            if "customer_name" in update_data:
                order.customer_name = update_data["customer_name"]
            if "items" in update_data:
                # Recalculate the total bill if items are updated
                total_bill = 0.0
                for cart_item in update_data["items"]:
                    for menu_item in menu_db:
                        if menu_item.id == cart_item["menu_item_id"]:
                            total_bill += menu_item.price * cart_item["quantity"]
                            break
                order.total_bill = total_bill
                order.items = update_data["items"]
            return {"message": "Order partially updated", "order": order}
    raise HTTPException(status_code=404, detail="Order not found")

# DELETE: Remove an order by ID
@app.delete("/orders/{order_id}")
def delete_order(order_id: int):
    for index, order in enumerate(orders_db):
        if order.order_id == order_id:
            del orders_db[index]
            return {"message": "Order deleted successfully"}
    raise HTTPException(status_code=404, detail="Order not found")
