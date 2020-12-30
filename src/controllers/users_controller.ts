import crypto from 'crypto';
import util from '../utils/authUtil';
import resMessage from '../utils/resMessage';
import express, { Request, Response, NextFunction, Send } from 'express';
import { usersService } from '../services';

export const signup = async (req: Request, res: Response) => {
  const {} = req.body;

  try {
  } catch (err) {}
};

export const signupByApple = async (req: Request, res: Response) => {
  const {} = req.body;

  try {
  } catch (err) {}
};

export const signupByKakao = async (req: Request, res: Response) => {
  const {} = req.body;

  try {
  } catch (err) {}
};

export const signin = async (req: Request, res: Response) => {
  const {} = req.body;

  try {
  } catch (err) {}
};

export const readAll = async (req: Request, res: Response) => {
  try {
    await usersService.readAll(); //라우팅 테스트용
    res.send('result'); //라우팅 테스트용
  } catch (err) {}
};

export const readOne = async (req: Request, res: Response) => {
  try {
  } catch (err) {}
};

export const updateInfo = async (req: Request, res: Response) => {
  try {
  } catch (err) {}
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
  } catch (err) {}
};

export const deleteOne = async (req: Request, res: Response) => {
  try {
  } catch (err) {}
};
