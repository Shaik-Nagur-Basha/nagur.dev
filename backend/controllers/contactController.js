import Contact from "../models/Contact.js";
import { addContactToSheet } from "../services/googleSheets.js";

// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    // Also add to Google Sheet if service is available
    try {
      await addContactToSheet({
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        submittedAt: contact.submittedAt,
      });
    } catch (sheetError) {
      console.error("Google Sheets Error:", sheetError.message);
    }

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private (Admin)
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status (Read/Unread)
// @route   PUT /api/contacts/:id
// @access  Private (Admin)
export const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private (Admin)
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
