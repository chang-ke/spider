#!/usr/bin/env python
#coding:utf-8
"""
file:spider.py
date:2018-10-28
author:dengbin
"""
from pyquery import PyQuery as pq
import requests

if __name__ == "__main__":
    response = requests.get(url="http://www.shicimingju.com/chaxun/shici/%E6%B0%B4%E8%B0%83%E6%AD%8C%E5%A4%B4")
    response.encoding = "utf-8"
    h3 = pq(response.text)('h3').children()
    file = open("./lib/poem_data.txt", mode="a", encoding="utf-8")
    for i in range(0, h3.size() - 1):
        href = 'http://www.shicimingju.com' + h3.eq(i).attr('href')
        d = pq(requests.get(href).text)
        title = d.find(".shici-title").text()
        content = d.find('.shici-content').text()
        file.write("\n" + title + "," + content + "\n")

    file.close()