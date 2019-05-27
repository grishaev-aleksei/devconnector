const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.get('/test', (req, res) => {
    res.json({
        msg: 'Profile works'
    })
});
const errors = {};

router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {


    try {
        const profile = await Profile.findOne({user: req.user.id});
        if (!profile) {
            errors.noprofile = 'there is no profile for this user';
            return res.status(404).json(errors)
        }
        res.json(profile)
    } catch (e) {
        res.status(404).json(e)
    }
});

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    if (typeof req.body.skills !== 'undefined') profileFields.skills = req.body.skills.split(',');
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    try {
        const profile = await Profile.findOne({user: req.user.id});
        if (profile) {
            const updatedProfile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true});
            return res.json(updatedProfile)
        } else {
            const profile = await Profile.findOne({handle: profileFields.handle});
            if (profile) {
                errors.handle = 'that handle already exists';
                return res.status(400).json(errors);
            }
            const newProfile = await new Profile(profileFields).save();
            return res.json(newProfile)
        }
    } catch (e) {
        res.json(e)
    }


});


module.exports = router;