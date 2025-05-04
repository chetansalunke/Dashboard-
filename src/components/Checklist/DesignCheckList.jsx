import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Plus, Save, Trash2 } from "lucide-react";

export default function DesignCheckList({ onSave, preselectedItems = [] }) {
  const dummyCategories = [
    {
      id: 1,
      name: "Project Setup and Standards",
      subcategories: [
        {
          id: 101,
          name: "Sheet Setup and Organization",
          items: [
            {
              id: 1001,
              text: "Verify the project uses the correct Revit template with appropriate units",
            },
            {
              id: 1002,
              text: "Confirm that the template includes necessary view templates and annotation styles",
            },
            {
              id: 1003,
              text: "Check that project units are consistent throughout the model",
            },
          ],
        },
        {
          id: 102,
          name: "Levels and Grids",
          items: [
            {
              id: 1004,
              text: "Verify that all relevant levels are created and named according to project standards",
            },
            {
              id: 1005,
              text: "Check that levels represent finished floor elevations and ceiling heights",
            },
            {
              id: 1006,
              text: "Ensure grids are created and named according to project standards",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Building Elements - Detailed Modeling",
      subcategories: [
        {
          id: 201,
          name: "Walls",
          items: [
            {
              id: 2001,
              text: "Model all exterior and interior walls with accurate dimensions",
            },
            {
              id: 2002,
              text: "Verify that wall types are correctly defined with appropriate layers",
            },
            {
              id: 2003,
              text: "Assign correct fire ratings to walls based on code requirements",
            },
          ],
        },
        {
          id: 202,
          name: "Floors",
          items: [
            {
              id: 2004,
              text: "Model floor structure with accurate thicknesses and materials",
            },
            {
              id: 2005,
              text: "Ensure proper support conditions for floor structures",
            },
            {
              id: 2006,
              text: "Model openings and penetrations in floor structures",
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Model Detailing and Refinement",
      subcategories: [
        {
          id: 301,
          name: "Embedded Elements",
          items: [
            {
              id: 3001,
              text: "Model embedded elements in walls and ceilings",
            },
            {
              id: 3002,
              text: "Coordinate the placement of embedded elements with MEPF systems",
            },
          ],
        },
        {
          id: 302,
          name: "Annotations and Tags",
          items: [
            {
              id: 3003,
              text: "Annotate the model with dimensions, tags, and text notes",
            },
            {
              id: 3004,
              text: "Use appropriate dimension types and ensure consistent dimension styles",
            },
            {
              id: 3005,
              text: "Tag all model elements with appropriate tags",
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: "Model Quality Control and Coordination",
      subcategories: [
        {
          id: 401,
          name: "Clash Detection",
          items: [
            {
              id: 4001,
              text: "Perform clash detection to identify and resolve conflicts",
            },
            {
              id: 4002,
              text: "Use Revit's Interference Check tool or other clash detection software",
            },
            {
              id: 4003,
              text: "Document and track clash resolutions",
            },
          ],
        },
        {
          id: 402,
          name: "Model Performance",
          items: [
            {
              id: 4004,
              text: "Purge unused families and elements to optimize model size",
            },
            {
              id: 4005,
              text: "Audit and clean up the model regularly",
            },
          ],
        },
      ],
    },
  ];

  const [categories, setCategories] = useState(dummyCategories);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [newItemText, setNewItemText] = useState("");
  const [addingTo, setAddingTo] = useState(null);

  // Initialize from preselectedItems
  useEffect(() => {
    if (preselectedItems.length > 0) {
      // Convert preselectedItems to the format we need - simple text items
      const initialItems = preselectedItems.map((item) => {
        return typeof item === "object"
          ? item
          : { id: Math.random(), text: item };
      });

      setSelectedItems(initialItems);

      // Find which categories may contain these items (if any)
      const selectedCatIdsSet = new Set();

      categories.forEach((category) => {
        category.subcategories.forEach((subcategory) => {
          subcategory.items.forEach((item) => {
            if (
              initialItems.some(
                (selected) =>
                  selected.id === item.id || selected.text === item.text
              )
            ) {
              selectedCatIdsSet.add(category.id);
            }
          });
        });
      });

      setSelectedCategories(Array.from(selectedCatIdsSet));
    }
  }, [preselectedItems]);

  // Update selected items when categories change
  useEffect(() => {
    const items = [];
    categories.forEach((category) => {
      if (selectedCategories.includes(category.id)) {
        category.subcategories.forEach((subcategory) => {
          items.push(...subcategory.items);
        });
      }
    });
    setSelectedItems(items);
  }, [selectedCategories, categories]);

  const handleCategoryToggle = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleItemSelect = (item) => {
    // Check if item is already selected
    const isSelected = selectedItems.some(
      (selected) => selected.id === item.id
    );

    if (isSelected) {
      // Remove the item
      setSelectedItems(
        selectedItems.filter((selected) => selected.id !== item.id)
      );
    } else {
      // Add the item
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleAddItem = (categoryId, subcategoryId) => {
    setAddingTo({ categoryId, subcategoryId });
    setNewItemText("");
  };

  const handleSaveNewItem = () => {
    if (!newItemText.trim() || !addingTo) return;

    const newItemId =
      Math.max(...selectedItems.map((item) => item.id || 0), 0) + 1;
    const newItem = { id: newItemId, text: newItemText.trim() };

    const updatedCategories = categories.map((category) => {
      if (category.id === addingTo.categoryId) {
        return {
          ...category,
          subcategories: category.subcategories.map((subcategory) => {
            if (subcategory.id === addingTo.subcategoryId) {
              return {
                ...subcategory,
                items: [...subcategory.items, newItem],
              };
            }
            return subcategory;
          }),
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    setSelectedItems([...selectedItems, newItem]);
    setNewItemText("");
    setAddingTo(null);
  };

  const handleCancelAddItem = () => {
    setAddingTo(null);
    setNewItemText("");
  };

  const handleSaveToBackend = () => {
    // Extract just the text of the selected items
    const itemsTextOnly = selectedItems.map((item) => item.text);

    // Pass only the array of text strings to parent
    if (onSave) {
      onSave(itemsTextOnly);
    }
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
  };

  const isItemSelected = (itemId) => {
    return selectedItems.some((item) => item.id === itemId);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/3 bg-white p-4 border-r border-gray-200 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border border-gray-200 rounded-md"
              >
                <div className="flex items-center p-3 bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategorySelect(category.id)}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <div
                    className="flex-1 font-medium cursor-pointer flex items-center"
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown size={18} className="mr-1 text-gray-500" />
                    ) : (
                      <ChevronRight size={18} className="mr-1 text-gray-500" />
                    )}
                    {category.name}
                  </div>
                </div>
                {expandedCategories.includes(category.id) && (
                  <div className="pl-8 pr-3 py-2 border-t border-gray-200">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="py-1 flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-700">
                          {subcategory.name}
                        </span>
                        <button
                          onClick={() =>
                            handleAddItem(category.id, subcategory.id)
                          }
                          className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Checklist Items
            </h2>
            <button
              onClick={handleSaveToBackend}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Save size={16} className="mr-2" /> Save Checklist
            </button>
          </div>
          {selectedCategories.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p>Select categories to view checklist items</p>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map(
                (category) =>
                  selectedCategories.includes(category.id) && (
                    <React.Fragment key={category.id}>
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="mb-4">
                          <h3 className="text-md font-medium text-gray-700 mb-2">
                            {subcategory.name}
                          </h3>
                          <div className="space-y-2">
                            {subcategory.items.map((item) => (
                              <div
                                key={item.id}
                                className={`flex items-center p-3 bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                                  isItemSelected(item.id)
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200"
                                }`}
                                onClick={() => handleItemSelect(item)}
                              >
                                <span className="flex-1 text-gray-800">
                                  {item.text}
                                </span>
                                {isItemSelected(item.id) && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveItem(item.id);
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  )
              )}
            </div>
          )}
          {addingTo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-lg font-semibold mb-4">
                  Add New Checklist Item
                </h3>
                <textarea
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Enter checklist item text..."
                  className="w-full border border-gray-300 rounded-md p-2 mb-4 h-24"
                ></textarea>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancelAddItem}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNewItem}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
