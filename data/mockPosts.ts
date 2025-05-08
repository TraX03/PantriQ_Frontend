import { Post } from "@/components/PostCard";
import React from "react";

export const mockPosts: Post[] = [
  {
    id: "1",
    type: "recipe",
    title: "Creamy Garlic Chicken Pasta",
    image:
      "https://images.unsplash.com/photo-1612152328178-4a6c83d96429?q=80&w=2650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Chef Jamie",
    profilePic:
      "https://images.unsplash.com/photo-1497316730643-415fac54a2af?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    type: "tips",
    title: "How to Make Avocados Last Longer",
    image:
      "https://images.unsplash.com/photo-1551244952-fab4c6c3a571?q=80&w=2640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Plant Based Bliss",
    profilePic:
      "https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    type: "tips",
    title: "The Best Way to Store Fresh Herbs",
    image:
      "https://images.unsplash.com/photo-1552600291-f88cf2b89d2c?q=80&w=2660&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Herb Master",
    profilePic:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2650&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    id: "4",
    type: "tips",
    title: "How to Cut a Pineapple Without the Hassle",
    image:
      "https://images.unsplash.com/photo-1580918403340-524f4b8bfa5b?q=80&w=2640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Fruit Lovers",
    profilePic:
      "https://images.unsplash.com/photo-1579533032448-7581997c7a2c?q=80&w=2660&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    id: "5",
    type: "discussion",
    title: "Best Meatless Monday Recipes",
    image:
      "https://images.unsplash.com/photo-1590775184359-d6e9259fc90f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Meatless Lovers",
    profilePic:
      "https://images.unsplash.com/photo-1497316730643-415fac54a2af?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "11",
    type: "discussion",
    title: "Best Meatless Monday Recipes",
    image:
      "https://images.unsplash.com/photo-1590775184359-d6e9259fc90f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Meatless Lovers",
    profilePic:
      "https://images.unsplash.com/photo-1497316730643-415fac54a2af?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "12",
    type: "discussion",
    title: "Best Meatless Monday Recipes",
    image:
      "https://images.unsplash.com/photo-1590775184359-d6e9259fc90f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Meatless Lovers",
    profilePic:
      "https://images.unsplash.com/photo-1497316730643-415fac54a2af?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "13",
    type: "discussion",
    title: "Best Meatless Monday Recipes",
    image:
      "https://images.unsplash.com/photo-1590775184359-d6e9259fc90f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Meatless Lovers",
    profilePic:
      "https://images.unsplash.com/photo-1497316730643-415fac54a2af?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "14",
    type: "discussion",
    title: "Best Meatless Monday Recipes",
    image:
      "https://images.unsplash.com/photo-1590775184359-d6e9259fc90f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Meatless Lovers",
    profilePic:
      "https://images.unsplash.com/photo-1497316730643-415fac54a2af?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "15",
    type: "discussion",
    title: "Best Meatless Monday Recipes",
    image:
      "https://images.unsplash.com/photo-1590775184359-d6e9259fc90f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Meatless Lovers",
    profilePic:
      "https://images.unsplash.com/photo-1497316730643-415fac54a2af?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "6",
    type: "discussion",
    title: "Is Gluten-Free the Way to Go?",
    image:
      "https://images.unsplash.com/photo-1603890166879-d35bc9f992eb?q=80&w=2660&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Healthy Habits",
    profilePic:
      "https://images.unsplash.com/photo-1571345610151-c14d9cc1b93b?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "7",
    type: "discussion",
    title: "Best Kitchen Gadgets for Cooking Like a Pro",
    image:
      "https://images.unsplash.com/photo-1600282286244-6f948399a6b2?q=80&w=2650&auto=format&fit=crop&ixlib=rb-4.0.3",
    author: "Gadget Guru",
    profilePic:
      "https://images.unsplash.com/photo-1497316730643-415fac54a2af?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "8",
    type: "recipe",
    title: "Classic Beef Tacos",
    image:
      "https://plus.unsplash.com/premium_photo-1661730314652-911662c0d86e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Taco Town",
    profilePic:
      "https://images.unsplash.com/photo-1497316730643-415fac54a2af?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "9",
    type: "community",
    title: "Quick & Easy Weeknight Meals",
    image:
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=2650&auto=format&fit=crop&ixlib=rb-4.0.3",
    membersCount: 3400,
    recipesCount: 124,
  },
  {
    id: "10",
    type: "community",
    title: "Gluten-Free Living",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2650&auto=format&fit=crop&ixlib=rb-4.0.3",
    membersCount: 2150,
    recipesCount: 86,
  },
];
